import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import MessageBox from "../components/MessageBox";
import { userDetailss } from "../actions/user";

let allUsers = [];
let allMessages = [];
let allSelectedUser = {};

export default function Support(props) {
  // const ENDPOINT =
  //   window.location.host.indexOf("localhost") >= 0
  //     ? "http://127.0.0.1:5000"
  //     : window.location.host;

  const ENDPOINT = "https://amazona-api.vercel.app";

  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const uiMessagesRef = useRef(null);

  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;
  const userDetails = useSelector((state) => state.userDetailsReducer);
  const { loading, error, user } = userDetails;

  if (!userInfo) {
    props.history.push("/signin");
  }
  const dispatch = useDispatch();

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight + 100,
        left: 0,
        behavior: "smooth",
      });
    }

    if (!user) {
      dispatch(userDetailss(userInfo?.data?.user._id));
    } else {
      if (!socket) {
        //prevents infinite connections
        const sk = socketIOClient(ENDPOINT, {
          withCredentials: true,
          transports: ["polling"], // Attempt WebSocket first, fallback to polling
      });      
        setSocket(sk);
        sk.emit("onLogin", {
          _id: userInfo.data.user._id,
          name: userInfo.data.user.name,
          isAdmin: user.isAdmin,
        });
        sk.on("updateUser", (updatedUser) => {
          const userExist = allUsers.find(
            (user) => user._id === updatedUser._id
          );
          //if user exists, overwrite him instead of adding him again to the list
          if (userExist) {
            allUsers = allUsers.map((user) =>
              user._id === userExist._id
                ? { ...updatedUser, unread: user.unread || updatedUser.unread }
                : user
            );
          } else {
            // If the user doesn't exist in allUsers, add them with the updated data
            allUsers = [...allUsers, updatedUser];
          }
          setUsers([...allUsers]);
        });
        sk.on("listUsers", (updatedUsers) => {
          allUsers = updatedUsers.map((user) => {
            const existingUser = allUsers.find((u) => u._id === user._id);
            return existingUser
              ? { ...user, unread: existingUser.unread }
              : user;
          });

          setUsers([...allUsers]);
        });
        sk.on("selectUser", (user) => {
          allMessages = user.messages;
          setMessages(allMessages);
        });
        sk.on("recieveMessage", (data) => {
          if (allSelectedUser._id === data._id) {
            allMessages = [...allMessages, data];
          } else {
            const userExist = allUsers.find((user) => user._id === data._id);
            if (userExist._id) {
              allUsers = allUsers.map((user) =>
                user._id === userExist._id ? { ...user, unread: true } : user
              );
              setUsers(allUsers); // Ensure state updates with new 'unread' status
            }
          }
          setMessages(allMessages);
        });
      }
    }
  }, [
    dispatch,
    socket,
    users,
    messages,
    user,
    ENDPOINT,
    userInfo.data.user._id,
    userInfo.data.user.name,
  ]);

  const selectUser = (user) => {
    allSelectedUser = user;
    setSelectedUser(allSelectedUser);

    const userExist = allUsers.find((x) => x._id === user._id);
    if (userExist) {
      allUsers = allUsers.map((x) =>
        x._id === userExist._id ? { ...x, unread: false } : x
      );
      setUsers(allUsers);
    }
    socket.emit("onUserSelected", user);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    allMessages = [
      ...allMessages,
      { body: messageBody, name: userInfo.data.user.name },
    ];
    setMessages(allMessages);
    setMessageBody("");
    socket.emit("sendMessage", {
      body: messageBody,
      name: userInfo.data.user.name,
      isAdmin: user.isAdmin,
      _id: selectedUser._id,
    });
  };

  return (
    <div className="chat-room">
      <div className="user-container">
        {userInfo &&
        users.filter((user) => user._id !== userInfo.data.user._id).length ===
          0 ? (
          <MessageBox>There is no users online</MessageBox>
        ) : (
          <MessageBox variant="success">Online users</MessageBox>
        )}
        {userInfo &&
          users
            .filter((x) => x._id !== userInfo.data.user._id)
            // .filter((x) => x.name)
            .map((user) => (
              <div
                key={user._id}
                className={`${
                  user._id === allSelectedUser._id
                    ? "user-info selected"
                    : "user-info"
                }`}
                onClick={() => selectUser(user)}
              >
                <h1 className="block">{user.name}</h1>
                <div
                  className={
                    user.unread ? "unread" : user.online ? "online" : "offline"
                  }
                ></div>
              </div>
            ))}
      </div>
      <div className="chat">
        {selectedUser._id ? (
          <div>
            <div ref={uiMessagesRef} className="message-container">
              <h2>{selectedUser.name}</h2>

              {messages.map((message, i) => (
                <div key={i} className="message-info">
                  <h2>{message.name}</h2>
                  <p>{message.body}</p>
                </div>
              ))}
            </div>
            <form onSubmit={submitHandler} className="chat-form">
              <input
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                type="text"
                placeholder="Enter your message"
              />

              <button className="primary" type="submit">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="chat">
            <div className="message-container">
              <MessageBox>Select a user to chat with!</MessageBox>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
