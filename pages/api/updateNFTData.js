import supabase from "../../src/app/utils/supabase";
const updateNFTData = async(req,res)=>{
    const  {mintId, walletId}  = req.body;
    console.log("mintId",mintId);
    console.log("walletId",walletId);
   
    
const { data, error } = await supabase
  .from('wallets')
  .insert([
    { mintId: mintId, walletId: walletId },
  ])


        if(error){
        res.status(400).json({message: error.message});
    }else{
        res.status(200).json({data});
    }
}
export default updateNFTData;