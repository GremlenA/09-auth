import { NextRequest,NextResponse} from "next/server";
export async function  post(request:NextRequest){
  const user = await request.json();

  return NextResponse.json({status:"Ok"});
}