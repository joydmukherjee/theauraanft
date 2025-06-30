import React from "react";
import { SectionWrapper } from "../hoc";
import { useMemo, useState } from "react";
import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  createUpdateMetadataAccountV2Instruction,
  DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { styles } from "../styles";
import * as anchor from "@project-serum/anchor";
import ReverseTimer from "./ReverseTimer";
const Mint = () => {
  const wallet = useWallet();

  const [nft, setNft] = useState(null);
  const [nftNoShow, setNftNoShow] = useState(null);
  const [flipNft, setFlipNft] = useState(false);
  const [disableMint, setDisableMint] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showMintButton, setShowMintButton] = useState(true);
  const [showError, setShowError] = useState(undefined);
  const candyMachineAddress = new PublicKey(
    process.env.NEXT_PUBLIC_CANDY_MACHINE_ID
  );
  let candyMachine;
  let walletBalance;
  const connection = useMemo(
    () => new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST, "confirmed"),
    []
  );
  const metaplex = useMemo(
    () => Metaplex.make(connection).use(walletAdapterIdentity(wallet)),
    [connection, wallet]
  );
  console.log(metaplex);

  const addListener = async () => {
    // add a listener to monitor changes to the candy guard
    metaplex.connection.onAccountChange(candyMachine.candyGuard.address, () =>
      checkEligibility("1")
    );

    // add a listener to monitor changes to the user's wallet
    metaplex.connection.onAccountChange(metaplex.identity().publicKey, () =>
      checkEligibility("2")
    );

    // add a listener to reevaluate if the user is allowed to mint if startDate is reached
    const slot = await metaplex.connection.getSlot();
    const solanaTime = await metaplex.connection.getBlockTime(slot);
    const startDateGuard = candyMachine.candyGuard.guards.startDate;
    if (startDateGuard != null) {
      const candyStartDate = startDateGuard.date.toString(10);
      const refreshTime = candyStartDate - solanaTime.toString(10);
      if (refreshTime > 0) {
        setTimeout(() => checkEligibility("3"), refreshTime * 1000);
      }
    }

    // also reevaluate eligibility after endDate is reached
    const endDateGuard = candyMachine.candyGuard.guards.endDate;
    if (endDateGuard != null) {
      const candyEndDate = endDateGuard.date.toString(10);
      const refreshTime = solanaTime.toString(10) - candyEndDate;
      if (refreshTime > 0) {
        setTimeout(() => checkEligibility("4"), refreshTime * 1000);
      }
    }
  };

  const checkEligibility = async (dis) => {
    console.log(dis);
    //wallet not connected?
    if (!wallet.connected) {
      setDisableMint(true);

      return;
    }

    // read candy machine state from chain
    candyMachine = await metaplex
      .candyMachines()
      .findByAddress({ address: candyMachineAddress });
    console.log(candyMachine);
    // enough items available?
    console.log(
      candyMachine.itemsMinted.toString(),
      candyMachine.itemsAvailable.toString()
    );
    if (
      candyMachine.itemsMinted.toString() -
        candyMachine.itemsAvailable.toString() >=
      0
    ) {
      setShowError("Not enough items available");
      //console.error("not enough items available");
      setDisableMint(true);
      return;
    }

    // guard checks have to be done for the relevant guard group! Example is for the default groups defined in Part 1 of the CM guide
    const guard = candyMachine.candyGuard.guards;

    // Calculate current time based on Solana BlockTime which the on chain program is using - startTime and endTime guards will need that
    const slot = await metaplex.connection.getSlot();
    const solanaTime = await metaplex.connection.getBlockTime(slot);

    if (guard.startDate != null) {
      const candyStartDate = guard.startDate.date.toString(10);
      if (solanaTime < candyStartDate) {
        setShowError("Minting not live yet");
        //console.error("startDate: CM not live yet");
        setDisableMint(true);
        return;
      }
    }

    if (guard.endDate != null) {
      const candyEndDate = guard.endDate.date.toString(10);
      if (solanaTime > candyEndDate) {
        setShowError("Minting not live anymore");
        //console.error("endDate: CM not live anymore");
        setDisableMint(true);
        return;
      }
    }

    if (guard.addressGate != null) {
      if (
        metaplex.identity().publicKey.toBase58() !=
        guard.addressGate.address.toBase58()
      ) {
        setShowError("Sorry! You are not allowed to mint");
        //console.error("addressGate: You are not allowed to mint");
        setDisableMint(true);
        return;
      }
    }

    if (guard.mintLimit != null) {
      const mitLimitCounter = metaplex.candyMachines().pdas().mintLimitCounter({
        id: guard.mintLimit.id,
        user: metaplex.identity().publicKey,
        candyMachine: candyMachine.address,
        candyGuard: candyMachine.candyGuard.address,
      });
      //Read Data from chain
      const mintedAmountBuffer = await metaplex.connection.getAccountInfo(
        mitLimitCounter,
        "processed"
      );
      let mintedAmount;
      if (mintedAmountBuffer != null) {
        mintedAmount = mintedAmountBuffer.data.readUintLE(0, 1);
      }
      if (mintedAmount != null && mintedAmount >= guard.mintLimit.limit) {
        setShowError("MintLimit reached!");
        //console.error("mintLimit: mintLimit reached!");
        setDisableMint(true);
        return;
      }
    }

    if (guard.solPayment != null) {
      walletBalance = await metaplex.connection.getBalance(
        metaplex.identity().publicKey
      );

      const costInLamports = guard.solPayment.amount.basisPoints.toString(10);

      if (costInLamports > walletBalance) {
        setShowError("Not enough SOL!");
        //console.error("solPayment: Not enough SOL!");
        setDisableMint(true);
        return;
      }
    }

    if (guard.freezeSolPayment != null) {
      walletBalance = await metaplex.connection.getBalance(
        metaplex.identity().publicKey
      );

      const costInLamports =
        guard.freezeSolPayment.amount.basisPoints.toString(10);

      if (costInLamports > walletBalance) {
        setShowError("Not enough SOL!");
        //console.error("freezeSolPayment: Not enough SOL!");
        setDisableMint(true);
        return;
      }
    }

    if (guard.nftGate != null) {
      const ownedNfts = await metaplex
        .nfts()
        .findAllByOwner({ owner: metaplex.identity().publicKey });
      const nftsInCollection = ownedNfts.filter((obj) => {
        return (
          obj.collection?.address.toBase58() ===
            guard.nftGate.requiredCollection.toBase58() &&
          obj.collection?.verified === true
        );
      });
      if (nftsInCollection.length < 1) {
        setShowError("The user has no NFT to pay with!");
        //console.error("nftGate: The user has no NFT to pay with!");
        setDisableMint(true);
        return;
      }
    }

    if (guard.nftBurn != null) {
      const ownedNfts = await metaplex
        .nfts()
        .findAllByOwner({ owner: metaplex.identity().publicKey });
      const nftsInCollection = ownedNfts.filter((obj) => {
        return (
          obj.collection?.address.toBase58() ===
            guard.nftBurn.requiredCollection.toBase58() &&
          obj.collection?.verified === true
        );
      });
      if (nftsInCollection.length < 1) {
        setShowError("The user has no NFT to pay with!");
        //console.error("nftBurn: The user has no NFT to pay with!");
        setDisableMint(true);
        return;
      }
    }

    if (guard.nftPayment != null) {
      const ownedNfts = await metaplex
        .nfts()
        .findAllByOwner({ owner: metaplex.identity().publicKey });
      const nftsInCollection = ownedNfts.filter((obj) => {
        return (
          obj.collection?.address.toBase58() ===
            guard.nftPayment.requiredCollection.toBase58() &&
          obj.collection?.verified === true
        );
      });
      if (nftsInCollection.length < 1) {
        setShowError("The user has no NFT to pay with!");
        //console.error("nftPayment: The user has no NFT to pay with!");
        setDisableMint(true);
        return;
      }
    }

    if (guard.redeemedAmount != null) {
      if (
        guard.redeemedAmount.maximum.toString(10) <=
        candyMachine.itemsMinted.toString(10)
      ) {
        setShowError("Too many NFTs have already been minted!");

        setDisableMint(true);
        return;
      }
    }

    if (guard.tokenBurn != null) {
      const ata = await metaplex.tokens().pdas().associatedTokenAccount({
        mint: guard.tokenBurn.mint,
        owner: metaplex.identity().publicKey,
      });
      const balance = await metaplex.connection.getTokenAccountBalance(ata);
      if (balance < guard.tokenBurn.amount.basisPoints.toNumber()) {
        setShowError("Not enough SPL tokens to burn!");
        //console.error("tokenBurn: Not enough SPL tokens to burn!");
        setDisableMint(true);
        return;
      }
    }

    if (guard.tokenGate != null) {
      const ata = await metaplex.tokens().pdas().associatedTokenAccount({
        mint: guard.tokenGate.mint,
        owner: metaplex.identity().publicKey,
      });
      const balance = await metaplex.connection.getTokenAccountBalance(ata);
      if (balance < guard.tokenGate.amount.basisPoints.toNumber()) {
        setShowError("Not enough SPL tokens!");
        //console.error("tokenGate: Not enough SPL tokens!");
        setDisableMint(true);
        return;
      }
    }

    if (guard.tokenPayment != null) {
      const ata = await metaplex.tokens().pdas().associatedTokenAccount({
        mint: guard.tokenPayment.mint,
        owner: metaplex.identity().publicKey,
      });
      const balance = await metaplex.connection.getTokenAccountBalance(ata);
      if (balance < guard.tokenPayment.amount.basisPoints.toNumber()) {
        setShowError("Not enough SPL tokens to pay!");
        // console.error("tokenPayment: Not enough SPL tokens to pay!");
        setDisableMint(true);
        return;
      }
      if (guard.freezeTokenPayment != null) {
        const ata = await metaplex.tokens().pdas().associatedTokenAccount({
          mint: guard.freezeTokenPayment.mint,
          owner: metaplex.identity().publicKey,
        });
        const balance = await metaplex.connection.getTokenAccountBalance(ata);
        if (balance < guard.tokenPayment.amount.basisPoints.toNumber()) {
          setShowError("Not enough SPL tokens to pay!");
          //console.error("freezeTokenPayment: Not enough SPL tokens to pay!");
          setDisableMint(true);
          return;
        }
      }
    }

    //good to go! Allow them to mint
    setDisableMint(false);
  };

  // show and do nothing if no wallet is connected
  if (!wallet.connected) {
    return null;
  }

  // if it's the first time we are processing this function with a connected wallet we read the CM data and add Listeners
  if (candyMachine === undefined) {
    (async () => {
      // read candy machine data to get the candy guards address
      await checkEligibility("5");
      // Add listeners to refresh CM data to reevaluate if minting is allowed after the candy guard updates or startDate is reached
      addListener();
    })();
  }
  const getMetadata = async (mint) => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };
  const onClick = async () => {
    setIsMinting(true);
    setShowError(undefined);
    // Here the actual mint happens. Depending on the guards that you are using you have to run some pre validation beforehand
    // Read more: https://docs.metaplex.com/programs/candy-machine/minting#minting-with-pre-validation
    try {
      const { nft } = await metaplex.candyMachines().mint(
        {
          candyMachine,
          collectionUpdateAuthority: candyMachine.authorityAddress,
        },
        { commitment: "finalized" }
      );
      console.log(nft);
      setNft(nft);
      setFlipNft(false);
      //now we will try to update the data to supabase since the nft is already minted.
      const res = await fetch("/api/updateNFTData", {
        method: "POST",
        body: JSON.stringify({
          mintId: nft.mint.address.toString(),
          walletId: wallet.publicKey.toString(),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const { data } = await res.json();
      console.log(data);
      console.log("successfully inserted");
      setIsMinting(false);
    } catch (error) {
      console.log(error);
      const errorString = error.toString();
      const comparisonString =
        "The NFT couldn't be fetched after being minted. This is most likely due to a bot tax that occured during minting. When someone tries to mint an NFT from a Candy Machine which cannot be minted from, the program will succeed and charge a small tax to fight against bots. Ensure you can mint from the Candy Machine.";
      let mint;
      let metadataKey;
        if (errorString.includes(comparisonString)) {
        const regex = /\[[^\]]*\]/g;
        const matches = errorString.match(regex);
        if (matches && matches.length >= 4) {
          // Extracting the string inside the fourth square bracket
           const thirdBracketContent = matches[3].slice(1, -1);
          const fourthBracketContent = matches[4].slice(1, -1);
          console.log(fourthBracketContent);
          
          if(thirdBracketContent==="MintAccount"){
          mint = new PublicKey(fourthBracketContent);
          metadataKey = await getMetadata(mint);
          }else{
           metadataKey = new PublicKey(fourthBracketContent); 
          }
          //fourthBracketContent is the nft address, so we need to fetch the metadata using the nft address.
          
          const promises2 = connection.getAccountInfo(metadataKey);
          const metadataAccounts = await promises2;
          let metadata = await Metadata.deserialize(metadataAccounts.data); //this contains on chain metadata.
          const meta = JSON.stringify(metadata[0]);
          const metaItem = JSON.parse(meta);
          try {
            const nfts = await fetch(metadata[0].data.uri);
            console.log(nfts);
            const json = await nfts.json(); //this contains off-chain metadata.
            const js = JSON.stringify(json);
            const newJson = JSON.parse(js);
            console.log(newJson);
            setNftNoShow(newJson);
            setFlipNft(true);
            const res = await fetch("/api/updateNFTData", {
              method: "POST",
              body: JSON.stringify({
                mintId: fourthBracketContent,
                walletId: wallet.publicKey.toString(),
              }),
              headers: { "Content-Type": "application/json" },
            });

            const { data } = await res.json();
            console.log(data);
            console.log("successfully inserted");
          } catch (error) {
            console.log(error);
            setShowError("Something is wrong! Please try later.");
          }
        } else {
          setShowError("Something is wrong! Please try later.");
        }
      } else {
        setShowError("Something is wrong! Please try later.");
      }
      setIsMinting(false);
    }
  };
  return (
    <>
      <motion.div variants={textVariant()}>
        {/* <p className={styles.sectionSubText}>Introduction</p> */}
        <h2 className={styles.sectionHeadText}>Mint.</h2>
      </motion.div>
      {showTimer === true && <ReverseTimer className="text-white" />}
      {showTimer === false && (
        <div className="items-center">
          <div className="flex flex-col items-center justify-center h-[800px] bg-gradient-to-r from-customColor1 to-customColor2 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Get your brand new NFT here.
            </h2>
            {isMinting ? (
              <h1 className="text-l font-bold mb-4">Minting NFT...</h1>
            ) : (
              <button
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-2 px-4 border border-transparent rounded-md shadow-md transform transition duration-300 hover:scale-105"
                onClick={onClick}
                disabled={disableMint}
              >
                MINT
              </button>
            )}

            {showError !== undefined && (
              <h1 className="text-l font-bold mb-4">{showError}.</h1>
            )}
            {nft && !flipNft && (
              <div className="flex flex-row rounded-lg items-center justify-center border-2 mt-[15px] ml-2 mr-2 border-transparent p-[15px]">
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold font-mono italic mb-2">
                    Yayy!! Welcome to OCTO family!
                  </h3>
                  <img
                    className="h-[300px] w-[300px]"
                    src={nft.json.image}
                    id="nftPreview"
                    alt=""
                  />
                  <h5 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {nft.name}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                    {nft.json.description}
                  </p>
                </div>
              </div>
            )}
            {nftNoShow && flipNft && (
              <div className="flex flex-row rounded-lg items-center justify-center border-2 mt-[15px] ml-2 mr-2 border-transparent p-[15px]">
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold font-mono italic mb-2">
                    Yayy!! Welcome to OCTO family!
                  </h3>
                  <img
                    className="h-[300px] w-[300px]"
                    src={nftNoShow.image}
                    id="nftPreview"
                    alt=""
                  />
                  <h5 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {nftNoShow.name}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
                    {nftNoShow.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Mint, "mint");
