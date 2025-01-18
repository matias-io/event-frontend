import CardContainer from './Components/CardContainer';
import Footer from './Components/Footer';
import Header from './Components/Header';

const HomePage = () => {

  return (
    <>
      <Header />

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="mx-auto my-12">
            <h1 className="text-3xl font-semibold text-center mb-6">Current Market</h1>


            {/* API CALL DONE HERE USING FETCH */}
            <CardContainer/>
          </div>
        </main>

      </div>
        <Footer />
    </>
  );
};

export default HomePage;
