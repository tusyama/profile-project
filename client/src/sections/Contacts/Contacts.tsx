import styled from 'styled-components';
import { Heading, Link, SectionWrapper, Text } from '../../ui-kit';
import { ContactForm } from '../../components/ContactForm/ContactForm';

const ContactLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export function Contacts() {
  return (
    <SectionWrapper id="contact">
      <Heading as="h2" $size="h2">
        Контакты
      </Heading>
      <ContactLinks>
        <Text $variant="body">
          Email:{' '}
          <Link href="mailto:lisesx@gmail.com">lisesx@gmail.com</Link>
        </Text>
        <Text $variant="body">
          GitHub:{' '}
          <Link href="https://github.com/tusyama" target="_blank" rel="noopener noreferrer">
            tusyama
          </Link>
        </Text>
      </ContactLinks>
      <Heading as="h3" $size="h3">
        Форма обратной связи
      </Heading>
      <ContactForm />
    </SectionWrapper>
  );
}
