import type {Metadata} from "next";
import AdminHub from "./dashboard";
import "./hub.css";
export const metadata:Metadata={title:"Administração | MWeC",robots:{index:false,follow:false}};
export default function AdminPage(){return <AdminHub/>}
