import React, { useEffect, useState } from "react";
import {
  selectUserAddress,
  setOwshen,
  selectOwshen,
  selectIsTest,
  selectReceivedCoins,
} from "../../store/containerSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import InProgress from "../Modal/InProgress";
import TransactionModal from "../Modal/TransactionModal";
import { useMainApi } from "../../api/hooks/useMainApi";
import {
  shortenAddress,
  copyWalletAddress,
  trueAmount,
  getRound,
  chainIdOfWallet,
} from "../../utils/helper";
import { isChainIdExist } from "../../utils/networkDetails";

import "../../styles/main.css";
import CopyIcon from "../../pics/icons/copy.png";
import SendIcon from "../../pics/icons/send.png";
import SwapIcon from "../../pics/icons/swap.png";

const Main = ({ children }) => {
  const address = useSelector(selectUserAddress);
  const { setChainId } = useMainApi();
  const [networkChainId, setNetworkChainId] = useState(null);
  const OwshenWallet = useSelector(selectOwshen);
  const isTest = useSelector(selectIsTest);
  const receivedCoins = useSelector(selectReceivedCoins);
  const dispatch = useDispatch();

  const [tokenContract, setTokenContract] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isInprogress, setIsInprogress] = useState(false);
  const [isOpenWithdraw, setIsOpenWithdraw] = useState(false);

  useEffect(() => {
    // This code will run whenever `tokenContract` changes
    if (tokenContract) {
      dispatch(
        setOwshen({ type: "SET_SELECT_TOKEN_CONTRACT", payload: tokenContract })
      );
    }
  }, [tokenContract, dispatch]); // Add `tokenContract` as a dependency

  const getChainId = async () => {
    const ChainId = await chainIdOfWallet();
    setNetworkChainId(ChainId);
  };
  useEffect(() => {
    getChainId();
  }, []);

  useEffect(() => {
    if (networkChainId && isChainIdExist(networkChainId)) {
      setChainId(networkChainId);
    }
  }, [networkChainId, OwshenWallet.wallet, OwshenWallet.contract_address]);
  const canOpenModal = () => {
    if (isTest) {
      return setIsInprogress(true);
    }
    address ? setIsOpen(true) : toast.error("Connect your wallet first!");
  };
  const diveAmount = () => {
    let totalAmount = 0;
    const processedIndices = new Set();

    for (let i = 0; i < receivedCoins.length; i++) {
      const coin = receivedCoins[i];
      if (!processedIndices.has(coin?.index)) {
        totalAmount += +trueAmount(coin?.amount);

        processedIndices.add(coin?.index);
      }
    }

    return totalAmount;
  };

  return (
    <>
      <TransactionModal
        transactionType="Withdraw"
        setTokenContract={setTokenContract}
        isOpen={isOpenWithdraw}
        setIsOpen={setIsOpenWithdraw}
      />
      <TransactionModal
        transactionType="Send"
        tokenContract={tokenContract}
        setTokenContract={setTokenContract}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <InProgress isOpen={isInprogress} setIsOpen={setIsInprogress} />

      <div style={{ textAlign: "center" }}>
        <div className="mt-10 ">
          <Tooltip id="copy" place="top" content="Copy wallet address" />
          {OwshenWallet.wallet && (
            <button
              data-tooltip-id="copy"
              onClick={() => copyWalletAddress(OwshenWallet.wallet)}
              className="mt-4 rounded-2xl px-3 py-2 w-52 mx-auto justify-between border border-gray-300 bg-[#BBDCFBCC] dark:bg-blue-950 ease-in-out duration-300 flex"
            >
              {shortenAddress(OwshenWallet.wallet)}
              <img className="ml-2" src={CopyIcon} alt="copyIcon" />
            </button>
          )}

          <div className="text-3xl font-bold mt-4">
            {receivedCoins ? getRound(diveAmount()) : "0.0"} DIVE
          </div>
          <div className="text-lg mt-4">$? USD</div>
          <div className="my-8 flex justify-around w-32 mx-auto">
            <Tooltip id="Send" place="bottom" content="Send" />
            <button data-tooltip-id="Send" onClick={canOpenModal}>
              <img src={SendIcon} alt="sendIcon" />
            </button>
            <Tooltip id="Swap" place="bottom" content="Swap" />
            <button
              onClick={() => setIsInprogress(true)}
              data-tooltip-id="Swap"
              // onClick={openWithdraw}
            >
              <img src={SwapIcon} alt="swapIcon" />
            </button>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default Main;
