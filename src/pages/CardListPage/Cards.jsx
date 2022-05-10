import { memo } from 'react';
import styled from 'styled-components';

import { DisplayCard } from '../../components/Card';

import {
  encryptCardNumber,
  makeCardOwnerName,
  makeValidDate,
} from '../../utils/processCard';
import { splitCardNumbers } from '../../utils/regExp';

const Card = styled(DisplayCard)`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

function Cards({ cardList }) {
  return (
    <>
      {cardList.map(card => {
        const {
          cardColor,
          cardCompany,
          cardName,
          cardOwnerName,
          cardNumber,
          validDate,
        } = card;

        return (
          <Card
            bgColor={cardColor}
            company={cardCompany}
            size="medium"
            cardName={cardName}
            ownerName={makeCardOwnerName(cardOwnerName)}
            number={splitCardNumbers(encryptCardNumber(cardNumber), ' ') ?? ''}
            validDate={makeValidDate(validDate)}
            key={cardNumber}
          />
        );
      })}
    </>
  );
}

export default memo(Cards);
