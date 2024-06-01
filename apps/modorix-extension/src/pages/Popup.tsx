import { useEffect, useState } from "react";
import { XUser, getBlockedUsers } from "../background/block-user-gateway";
import "./Popup.css";

export default function Popup() {
  const [blockedUsers, setBlockedUsers] = useState<XUser[]>([]);

  useEffect(() => {
    refreshBlockedUsersList()
  }, []);

  async function refreshBlockedUsersList() {
    setBlockedUsers(await getBlockedUsers() )
  }

  return (
    <div>
      <img src="/icon-with-shadow.svg" />
      <h1>vite-plugin-web-extension</h1>
      <p>
        {JSON.stringify(blockedUsers)}
        Template: <code>react-ts</code>
      </p>
    </div>
  )
}
