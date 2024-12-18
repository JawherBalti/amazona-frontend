import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import { userDetailss } from "../actions/user";
import { useHistory } from "react-router-dom";

export default function ChatBox() {
  // const ENDPOINT =
  //   window.location.host.indexOf("localhost") >= 0
  //     ? "http://127.0.0.1:5000"
  //     : window.location.host;

  const ENDPOINT = 'https://amazona-api.vercel.app'

  const [toggleSupport, setToggleSupport] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const uiMessagesRef = useRef(null);

  const history = useHistory();

  const userSignIn = useSelector((state) => state.userSignInReducer);
  const { userInfo } = userSignIn;
  const userDetails = useSelector((state) => state.userDetailsReducer);
  const { user } = userDetails;

  const dispatch = useDispatch();

  const closeSupportHandler = useCallback(() => {
    setToggleSupport(false);
    socket?.disconnect();
  }, [socket]);

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight + 100,
        left: 0,
        behavior: "smooth",
      });
    }

    if (!user) {
      dispatch(userDetailss(userInfo?.data.user._id));
    }
    if (socket) {
      socket.emit("onLogin", {
        _id: userInfo?.data?.user._id,
        name: userInfo?.data?.user.name,
        isAdmin: user?.isAdmin,
      });
      socket.on("recieveMessage", (data) => {
        setMessages([...messages, { body: data.body, name: data.name }]);
      });
    }
    if (!userInfo) {
      closeSupportHandler();
    }
  }, [dispatch, user, socket, messages, userInfo, closeSupportHandler]);

  const openSupportHandler = () => {
    if (!userInfo) {
      history.push("/signin");
    } else {
      setToggleSupport(true);
      const sk = socketIOClient(ENDPOINT, {
        withCredentials: true,
        transports: ["polling"], // Attempt WebSocket first, fallback to polling
    });    
      setSocket(sk);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setMessages([
      ...messages,
      { body: messageBody, name: userInfo.data.user.name },
    ]);
    setMessageBody("");
    socket.emit("sendMessage", {
      body: messageBody,
      name: userInfo.data.user.name,
      isAdmin: user.isAdmin,
      _id: userInfo.data.user._id,
    });
  };

  return (
    <div className="contact">
      {toggleSupport ? (
        <div className="contact-box">
          <div className="header-box">
            <h2>Support</h2>
            <span onClick={closeSupportHandler}>X</span>
          </div>

          <div ref={uiMessagesRef} className="message-box">
            {messages.map((message, i) => (
              <div key={i} className="message-info">
                <span>{message.name}</span>
                <br />
                <p>{message.body}</p>
              </div>
            ))}
          </div>

          <form onSubmit={submitHandler} className="chat-form">
            <input
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              type="text"
              placeholder="Contact an admin"
            />
            <button className="primary" type="submit">
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="contact-icon">
          <button className="primary" onClick={openSupportHandler}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.581 19.4041C14.6645 19.9894 14.2606 20.5326 13.676 20.6211L12 20.9841C11.6307 21.1187 11.2169 21.0265 10.9398 20.7477C10.6627 20.469 10.5729 20.0546 10.7097 19.6861C10.8466 19.3176 11.1851 19.0623 11.577 19.0321L13.252 18.6701C13.8213 18.509 14.4142 18.8364 14.581 19.4041V19.4041Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7 15.9919C5.89543 15.9919 5 15.0965 5 13.9919V10.9919C5 9.88737 5.89543 8.99194 7 8.99194C8.10457 8.99194 9 9.88737 9 10.9919V13.9919C9 15.0965 8.10457 15.9919 7 15.9919Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17 15.9919C15.8954 15.9919 15 15.0965 15 13.9919V10.9919C15 9.88737 15.8954 8.99194 17 8.99194C18.1046 8.99194 19 9.88737 19 10.9919V13.9919C19 15.0965 18.1046 15.9919 17 15.9919Z"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M18.25 11C18.25 11.4142 18.5858 11.75 19 11.75C19.4142 11.75 19.75 11.4142 19.75 11H18.25ZM4.25 11C4.25 11.4142 4.58579 11.75 5 11.75C5.41421 11.75 5.75 11.4142 5.75 11H4.25ZM19.75 14.0023C19.7513 13.5881 19.4165 13.2513 19.0023 13.25C18.5881 13.2487 18.2513 13.5835 18.25 13.9977L19.75 14.0023ZM13.5113 19.8951C13.1071 19.9855 12.8527 20.3865 12.9431 20.7907C13.0335 21.1949 13.4345 21.4493 13.8387 21.3589L13.5113 19.8951ZM19.75 11V9H18.25V11H19.75ZM19.75 9C19.75 4.71979 16.2802 1.25 12 1.25V2.75C15.4518 2.75 18.25 5.54822 18.25 9H19.75ZM12 1.25C7.71979 1.25 4.25 4.71979 4.25 9H5.75C5.75 5.54822 8.54822 2.75 12 2.75V1.25ZM4.25 9V11H5.75V9H4.25ZM18.25 13.9977C18.2414 16.8289 16.2742 19.2771 13.5113 19.8951L13.8387 21.3589C17.2853 20.588 19.7393 17.534 19.75 14.0023L18.25 13.9977Z"
                  fill="#000000"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
