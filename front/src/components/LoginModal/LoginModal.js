import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LoginModal.css";
import styled from "styled-components";
import Close_round_light from "../../images/Close_round_light.png";
import NaverButton from "../../images/user/NaverLogin.png";
import KakaoButton from "../../images/user/KakaoLogin.png";

import * as Api from "../../api";
import { DispatchContext } from "../../App";

function LoginModal({ setLoginModalOpen }) {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);

  //useState로 email 상태를 생성함.
  const [email, setEmail] = useState("");
  //useState로 pwd 상태를 생성함.
  const [pwd, setPwd] = useState("");

  //이메일이 abc@example.com 형태인지 regex를 이용해 확인함.
  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  //위 validateEmail 함수를 통해 이메일 형태 적합 여부를 확인함.
  const isEmailValid = validateEmail(email);
  // 비밀번호가 4글자 이상인지 여부를 확인함.
  const isPwdValid = pwd.length >= 4;
  // 위 2개 조건이 모두 동시에 만족되는지 여부를 확인함.
  const isFormValid = isEmailValid && isPwdValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // "user/login" 엔드포인트로 post요청함.
      const res = await Api.post("user/login", {
        email,
        pwd,
      });
      // 유저 정보는 response의 data임.
      const user = res.data;
      // JWT 토큰은 유저 정보의 token임.
      const jwtToken = user.token;
      // sessionStorage에 "userToken"이라는 키로 JWT 토큰을 저장함.
      sessionStorage.setItem("userToken", jwtToken);
      // dispatch 함수를 이용해 로그인 성공 상태로 만듦.
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user,
      });

      // 기본 페이지로 이동함.
      navigate("/", { replace: true });
    } catch (err) {
      console.log("로그인에 실패하였습니다.\n", err);
    }
  };

  //모달창 끄기
  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <>
      <form>
        <div className="modalBackground">
          <div className="LoginModal">
            <div className="LoginModalContents">
              <img
                className="LoginCloseBtn"
                src={Close_round_light}
                onClick={closeLoginModal}
                width="32px"
                height="32px"
              ></img>

              <span className="title">로그인</span>

              <div className="emailBox">
                <input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></input>
              </div>
              {!isEmailValid && <alert>이메일 형식이 올바르지 않습니다.</alert>}

              <div className="pwdBox">
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요."
                  onChange={(e) => {
                    setPwd(e.target.value);
                  }}
                ></input>
              </div>
              {!isPwdValid && (
                <alert>비밀번호는 4글자 이상으로 설정해 주세요.</alert>
              )}

              <button
                className="LoginBtn"
                type="submit"
                disabled={!isFormValid}
              >
                로그인
              </button>

              <p>
                <a href="/signup">회원가입</a>
                <a> | </a>
                <a href="#">아이디/비밀번호 찾기</a>
              </p>

              <div className="divider">
                <div className="border"></div>
              </div>

              <div className="SocialBtn">
                <a href="https://www.naver.com">
                  <img
                    className="NaverBtn"
                    src={NaverButton}
                    onClick={NaverButton}
                  ></img>
                </a>
                <a href="https://www.kakaocorp.com">
                  <img
                    className="KakaoBtn"
                    src={KakaoButton}
                    onClick={KakaoButton}
                  ></img>
                </a>
              </div>

              <p>
                아직 미션체크 계정이 없나요?<a href="/signup"> 가입</a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default LoginModal;