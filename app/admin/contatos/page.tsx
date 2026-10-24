import type {Metadata} from "next";
import Inbox from "./inbox";
import "./inbox.css";

export const metadata:Metadata={
  title:"Caixa de entrada | MWeC",
  robots:{index:false,follow:false},
  description:"Área privada de acompanhamento de solicitações da MWeC."
};
export default function CrmInboxPage(){return <Inbox/>}
