import React, { useEffect, useState } from 'react';
// import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';

const WalletConnect = () => {
    const [walletConnected, setWalletConnected] = useState(false);
    // const tonConnectUI = useTonConnectUI();

    // useEffect(() => {
    //     tonConnectUI.onStatusChange((walletInfo) => {
    //         if (walletInfo) {
    //             setWalletConnected(true);
    //             console.log('Кошелек подключен:', walletInfo);
    //         } else {
    //             setWalletConnected(false);
    //         }
    //     });
    // }, [tonConnectUI]);

    return (
        <div>
            <h2>Подключите ваш кошелек</h2>
            {/*<TonConnectButton />*/}
            {walletConnected ? <p>Кошелек успешно подключен!</p> : <p>Кошелек не подключен.</p>}
        </div>
    );
};

export default WalletConnect;
