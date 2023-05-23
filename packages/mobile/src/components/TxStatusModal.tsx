import * as React from 'react';

import TxModal, { TxModalProps, TxStatusType } from '../components/TxModal';
import { TxStatus } from '../contexts/MonteqContractContext/MonteqContractContext';

type Props = {
  txStatus: TxStatus;
  isVisible: boolean;
  recipientId?: string;
  recipientName?: string;
  date?: string;
  fiatAmount?: string;
  cryptoAmount?: string;
  error?: string | null;
  onClose?: () => void;
  onRetry?: () => void;
};

const TxStatusModal: React.FC<Props> = ({
  txStatus,
  isVisible,
  recipientId,
  recipientName,
  date,
  fiatAmount,
  cryptoAmount,
  error,
  onClose,
  onRetry,
}) => {
  if (txStatus === TxStatus.Idle) return null;

  const modalPropsByStatus: { [key: number]: TxModalProps } = {
    [TxStatus.Sending]: {
      isVisible,
      recipientId,
      recipientName,
      date,
      fiatAmount,
      cryptoAmount,
      onRequestClose: onClose,
      title: 'Transaction signing',
      status: 'Signing',
      type: TxStatusType.Yellow,
      image: require('../assets/inProgress.png'),
    },
    [TxStatus.Mining]: {
      isVisible,
      recipientId,
      recipientName,
      date,
      fiatAmount,
      cryptoAmount,
      onRequestClose: onClose,
      title: 'Transaction sent',
      status: 'Mining',
      type: TxStatusType.Yellow,
      image: require('../assets/inProgress.png'),
    },
    [TxStatus.Done]: {
      isVisible,
      recipientId,
      recipientName,
      date,
      fiatAmount,
      cryptoAmount,
      onRequestClose: onClose,
      title: 'Transaction sent',
      status: 'Confirmed',
      type: TxStatusType.Green,
      image: require('../assets/confirmed.png'),
      primaryButton: 'Close',
      onPrimaryButtonPress: onClose,
    },
    [TxStatus.Rejected]: {
      isVisible,
      onRequestClose: onClose,
      title: 'Transaction rejected',
      description: error ?? 'You have rejected the transaction in the wallet',
      image: require('../assets/errorOccured.png'),
      primaryButton: 'Retry',
      onPrimaryButtonPress: onRetry,
      secondaryButton: 'Close',
      onSecondaryButtonPress: onClose,
    },
    [TxStatus.Failed]: {
      isVisible,
      onRequestClose: onClose,
      title: 'Transaction rejected',
      description: error ?? 'You have rejected the transaction in the wallet',
      image: require('../assets/errorOccured.png'),
      primaryButton: 'Retry',
      onPrimaryButtonPress: onRetry,
      secondaryButton: 'Close',
      onSecondaryButtonPress: onClose,
    },
  };

  const modalProps = modalPropsByStatus[txStatus];

  return (
    <TxModal
      isVisible={modalProps.isVisible}
      title={modalProps.title}
      status={modalProps.status}
      description={modalProps.description}
      type={modalProps.type}
      image={modalProps.image}
      recipientId={modalProps.recipientId}
      recipientName={modalProps.recipientName}
      date={modalProps.date}
      fiatAmount={modalProps.fiatAmount}
      cryptoAmount={modalProps.cryptoAmount}
      onRequestClose={modalProps.onRequestClose}
      primaryButton={modalProps.primaryButton}
      onPrimaryButtonPress={modalProps.onPrimaryButtonPress}
      secondaryButton={modalProps.secondaryButton}
      onSecondaryButtonPress={modalProps.onSecondaryButtonPress}
    />
  );
};

export default TxStatusModal;
