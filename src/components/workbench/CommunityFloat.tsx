import React from 'react';
import qrImage from '@/assets/community-qr.svg';
import styles from './CommunityFloat.module.css';

export const CommunityFloat: React.FC = () => {
  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.ball}>
        交流群
      </button>
      <div className={styles.popup}>
        <img src={qrImage} alt="算法交流群二维码" className={styles.qr} />
        <p>微信扫码发送 “leetcode” 加入交流群</p>
      </div>
    </div>
  );
};
