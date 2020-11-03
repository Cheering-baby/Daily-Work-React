import React, { FC, useEffect, useState } from 'react';
import Link from 'umi/link';

import styles from './Copyright.less';
import { queryDictionary } from '@/services/copyright';
import { SettingResult } from '@/types/settingResult';

const Copyright: FC<any> = () => {
  const [data, setData] = useState({} as SettingResult);

  useEffect(() => {
    queryDictionary().then(({ data: { resultCode, result }, success}) => {
      if(success && resultCode === '0') {
        setData(result);
      }

    });
  }, []);
  const {
    companyName,
    legalInformation,
    dataProtection,
    // frequentlyAskedQuestions,
    // contactUs,
  } = data;

  const legalInformationProps = {} as any;
  if(legalInformation) {
    legalInformationProps.href = `https://${legalInformation}`
  }
  const dataProtectionProps = {} as any;
  if(dataProtection) {
    dataProtectionProps.href = `https://${dataProtection}`
  }
  return (
    <footer className={styles.foot}>
      Copyright © {companyName} All Rights Reserved.
      <a  {...legalInformationProps} target="_blank" > Legal Information </a> | <a {...dataProtectionProps} target="_blank" >Data Protection</a> |

      <Link to="/about?key=termsConditions">Terms and Conditions</Link> |
      <Link to="/about?key=frequentlyAskedQuestions">Frequently Asked Questions</Link> |
      <Link to="/about?key=contactUs">Contact Us</Link>
    </footer>
  );
};
export default Copyright;
