import React, { useRef, useState, useEffect, useContext } from "react";
import "../../styles/ChallengeDetailModal.css";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Close_round_light from "../../images/Close_round_light.png";
import TimeLight from "../../images/challenge/TimeLight1x.png";
import OfficialChallenge from "../../images/challenge/OfficialChallenge1x.png";
import FavoriteLight from "../../images/challenge/FavoriteLight1x.png";
import UserFill from "../../images/challenge/UserFill1x.png";
import Gift from "../../images/challenge/Gift1x.png";
import Happy from "../../images/challenge/Happy1x.png";
import Sad from "../../images/challenge/Sad1x.png";
import { UserStateContext } from "../../App";
import * as Api from "../../api";
import Swal from "sweetalert2";
import UserLike from "../UserLike";
import { AppContext } from "../../Context/AppContext";

function ChallengeDetailModal({ setChallengeDetailModalOpen, item,person }) {
  const closeChallengeDetailModal = () => {
    setChallengeDetailModalOpen(false);
  };
  const [peopleCount, setPeopleCount] = useState(0);
  console.log("123", item.challengeId);
  const getDateDiff = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffDate = date1.getTime() - date2.getTime();
    return Math.abs(diffDate / (1000 * 60 * 60 * 24));
  };
  let dif = getDateDiff(item.fromDate, item.toDate);
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  const dateString = year + "-" + month + "-" + day;
  const { socket, currentRoom, setCurrentRoom } = useContext(AppContext);
  const [myPoint,setMyPoint]=useState(0)
  const navigate=useNavigate();
  const handleRoomSubmit = (e) => {
    e.preventDefault();
    // socket.emit('enterRoom',item.title,()=>{
    //   console.log(currentRoom)
    // })
    Api.post("userToChallenge", {
      challengeId: item.challengeId,
    });
    Api.put("minuspoint").then((res) => console.log("?????????????????????", res));
    closeChallengeDetailModal()
    Swal.fire({
      position:"top-center",
      icon: "success",
      text: "?????? ??????"
    })
  };

  useEffect(() => {
    Api.get("/countJoinUser", {
      challengeId: item.challengeId,
    }).then((res) => setPeopleCount(res));
    Api.get("point").then((res)=>setMyPoint(res.data))
  }, []);
  
  console.log(myPoint)
  return (
    <>
      <div className="modalBackground">
        <div className="challengeDetailModal">
          <div className="challengeDetailModalContents">
            <img
              className="challengeModalCloseBtn"
              src={Close_round_light}
              setChallengeDetailModalOpen={setChallengeDetailModalOpen}
              onClick={closeChallengeDetailModal}
              width="32px"
              height="32px"
              alt="?????? ??????"
            ></img>

            {/* ????????? ??????, ??????, ???????????? */}
            <div className="challengeDetailTop">
              <div className="challengeTopLeft">
                <img className="challengeImage" src={item.mainImg} alt=""></img>
               
              </div>
              <div className="challengeTopRight">
                <span>
                  <img src={OfficialChallenge} alt="V??????"></img> ?????? ?????????
                  <img
                    className="FavoriteLight"
                    src={FavoriteLight}
                    alt="??????"
                  ></img>
                </span>

                <h5>{item.title}</h5>
                <div className="challengeScroll">{item.description}</div>
              </div>
            </div>

            {/* ????????????, ????????? */}
            <div className="challengeDetailMiddle">
              <div className="challengeJoinNumber">
                <p className="personNum colorGray">
                  <img src={UserFill} alt="??????"></img>
                  ????????????
                </p>
                <span className="colorBlack">
                  {" "}
                  {person}???
                </span>
              </div>

              <div classNmae="challengePoint">
                <p className="expectedPoint colorGray">
                  <img src={Gift} alt="????????????"></img>
                  ?????????
                  <span className="colorBlack"> ??? {dif * 10 + 10}?????????</span>
                </p>
              </div>
            </div>

            {/* ????????? ???????????? */}
            <div className="challengeDetailBottom">
              <div className="challengeManual">
                <span className="manualTitle">????????? ????????????</span>
                <p>{item.method}</p>
              </div>

              <div className="challengeManualDescription">
                <div className="challengeManualDescriptionLeft">
                  <a>
                    <img src={Happy} alt="?????? ??????"></img> ????????? ???????????????!
                  </a>
                  <img
                    className="explainImage"
                    src={item.explainImg.split(",")[0]}
                    alt=""
                  ></img>
                  <a className="colorOrange">????????? ??? ???????????? ?????? ??????</a>
                </div>

                <div className="challengeManualDescriptionRight">
                  <a>
                    <img src={Sad} alt="????????? ??????"></img> ????????? ?????? ?????????!
                  </a>
                  <img
                    className="explainImage"
                    src={item.explainImg.split(",")[1]}
                    alt=""
                  ></img>
                  <a className="colorOrange">????????? ????????? ????????? ?????? ??????</a>
                </div>
              </div>
            </div>
          {myPoint>=50?
          <button
          className="challengeJoinBtn"
          type="submit"
          onClick={handleRoomSubmit}
          disabled={
            new Date(item.fromDate) <= new Date(dateString)
          }
          style={{
            background:
            new Date(item.fromDate) <= new Date(dateString)
            ? "rgb(179, 176, 176, 0.6)"
            : null,
            color:
            new Date(item.fromDate) <= new Date(dateString)
            ? "rgb(0,0,0)"
            : null
          }}
        >
          ????????????
        </button>
        :
        <button disabled='true' className="pointlessButton">????????? ??????</button>
          }
            
          </div>
        </div>
      </div>
    </>
  );
}

export default ChallengeDetailModal;
