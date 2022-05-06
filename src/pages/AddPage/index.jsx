import { memo, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useCardNumber,
  useCardOwnerName,
  useCardPassword,
  useCVC,
  useModal,
  useInput,
} from '../../hooks';

import CardInputs from './CardInputs';
import { Button } from '../../components';
import {
  CardCompany,
  CardCompanyModal,
  CardCompanyName,
  Dimmer,
  Header,
  NextButton,
  StyledCard,
  StyledPage,
  Title,
} from './styled';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';

import { CardContext, CardInfoContext } from '../../contexts';
import { CARD_COMPANY, NOW } from '../../constants';
import { encryptCardNumber, makeValidDate, preventBubbling } from '../../utils';
import { splitCardNumbers } from '../../utils/regExp';
import isValidCardInputs from '../../utils/validator';

function AddPage() {
  const [cardCompany, setCardCompany] = useState({
    name: '',
    color: '#D2D2D2',
  });
  const [cardNumber, setCardNumber] = useCardNumber('');
  const [cardOwnerName, setCardOwnerName] = useCardOwnerName('');
  const [validDate, setValidDate] = useInput(`${NOW.YEAR}-${NOW.MONTH}`);
  const [CVC, setCVC] = useCVC('');
  const [firstPassword, setFirstPassword] = useCardPassword('');
  const [secondPassword, setSecondPassword] = useCardPassword('');
  const [isCVCModalOpen, toggleIsCVCModalOpen] = useModal(false);
  const [isCardCompanyModalOpen, toggleIsCardCompanyModalOpen] =
    useModal(false);
  const [isPossible, setIsPossible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useContext(CardContext);

  const forwardValue = useMemo(
    () => ({
      cardNumber,
      setCardNumber,
      validDate,
      setValidDate,
      cardOwnerName,
      setCardOwnerName,
      CVC,
      setCVC,
      isModalOpen: isCVCModalOpen,
      toggleModal: toggleIsCVCModalOpen,
      firstPassword,
      setFirstPassword,
      secondPassword,
      setSecondPassword,
    }),
    [
      cardNumber,
      validDate,
      cardOwnerName,
      CVC,
      isCVCModalOpen,
      firstPassword,
      secondPassword,
    ]
  );

  useEffect(() => {
    try {
      isValidCardInputs(
        cardNumber,
        validDate,
        CVC,
        firstPassword,
        secondPassword
      );
      setIsPossible(true);
    } catch (e) {
      setIsPossible(false);
    }
  }, [cardNumber, validDate, CVC, firstPassword, secondPassword]);

  const onClickArrowButton = () => {
    navigate(-1);
  };

  const toggleCardTitleModal = () => {
    toggleIsCardCompanyModalOpen(!isCardCompanyModalOpen);
  };

  const onClickCardCompany = ({ currentTarget }) => {
    const { name, color } = currentTarget.dataset;

    setCardCompany({ name, color });
    toggleIsCardCompanyModalOpen(false);
  };

  const onClickNextButton = () => {
    dispatch({
      type: 'SAVE_CARD',
      card: {
        cardCompany: cardCompany.name,
        cardColor: cardCompany.color,
        cardNumber,
        cardOwnerName,
        validDate,
        CVC,
        password: firstPassword + secondPassword,
      },
    });

    navigate('/complete');
  };

  return (
    <CardInfoContext.Provider value={forwardValue}>
      <StyledPage>
        <Header>
          <Button size="small" onClickFunc={onClickArrowButton}>
            <Arrow />
          </Button>
          <Title>카드 추가</Title>
        </Header>
        <StyledCard
          bgColor={cardCompany.color}
          company={cardCompany.name}
          size="medium"
          name={cardOwnerName}
          number={splitCardNumbers(encryptCardNumber(cardNumber), ' ') ?? ''}
          validDate={makeValidDate(validDate)}
          onClickFunc={toggleCardTitleModal}
        />
        <CardInputs />
        {isPossible && (
          <NextButton
            color="#04C09E"
            fontWeight="bold"
            onClickFunc={onClickNextButton}
          >
            다음
          </NextButton>
        )}
        {isCardCompanyModalOpen && (
          <Dimmer onClick={toggleCardTitleModal}>
            <CardCompanyModal onClick={preventBubbling}>
              {CARD_COMPANY.map(({ name, color }) => (
                <CardCompany
                  data-name={name}
                  data-color={color}
                  onClick={onClickCardCompany}
                  key={name}
                >
                  <Button bgColor={color} shape="circle" />
                  <CardCompanyName>{name}</CardCompanyName>
                </CardCompany>
              ))}
            </CardCompanyModal>
          </Dimmer>
        )}
      </StyledPage>
    </CardInfoContext.Provider>
  );
}

export default memo(AddPage);
