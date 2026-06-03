import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Hero } from './sections/Hero/Hero';
import { About } from './sections/About/About';
import { WorkApproach } from './sections/WorkApproach/WorkApproach';
import { Cases } from './sections/Cases/Cases';
import { Contacts } from './sections/Contacts/Contacts';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <WorkApproach />
        <Cases />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}

export default App;
