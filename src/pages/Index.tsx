import { useState } from "react";
import { Users, Palette, Calendar, MapPin, Phone, Heart, Music, BookOpen, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center parallax-bg" 
        style={{
          backgroundImage: "url('/lovable-uploads/1308c64a-950e-4e06-8702-88f8206b6a05.png')",
        }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 text-center animate-fade-up">
          <img 
            src="/lovable-uploads/9ed77f9f-124b-4d91-8f31-f24528927836.png"
            alt="L'Altro Spazio"
            className="w-64 md:w-96 mx-auto mb-8"
          />
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light max-w-3xl mx-auto text-balance">
            Uno spazio culturale dove tutti si sentono sicuri, rispettati e inclusi
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
            onClick={() => setIsMenuOpen(true)}
          >
            Scopri i Nostri Eventi
          </Button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl text-secondary mb-8">La Nostra Missione</h2>
            <p className="text-lg text-secondary/80 leading-relaxed mb-12 text-balance">
              L'Altro Spazio è un ambasciatore culturale e una galleria d'arte nei quartieri Belvedere e 
              Parco 11 Settembre a Bologna. Crediamo che ognuno abbia qualcosa da offrire e siamo 
              appassionati nel creare spazi dove tutti possano sentirsi parte di una comunità.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center bg-white hover:shadow-lg transition-shadow">
                <Users className="w-10 h-10 mx-auto mb-4 text-primary" />
                <h3 className="font-display text-xl mb-2">Inclusività</h3>
                <p className="text-secondary/80">Uno spazio accessibile dove tutti sono benvenuti</p>
              </Card>
              <Card className="p-6 text-center bg-white hover:shadow-lg transition-shadow">
                <Palette className="w-10 h-10 mx-auto mb-4 text-primary" />
                <h3 className="font-display text-xl mb-2">Arte e Cultura</h3>
                <p className="text-secondary/80">Mostre, workshop e eventi culturali</p>
              </Card>
              <Card className="p-6 text-center bg-white hover:shadow-lg transition-shadow">
                <Heart className="w-10 h-10 mx-auto mb-4 text-primary" />
                <h3 className="font-display text-xl mb-2">Comunità</h3>
                <p className="text-secondary/80">Un luogo di incontro e attivismo sociale</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section - New */}
      <section className="section-padding bg-white">
        <div className="container">
          <h2 className="font-display text-4xl md:text-5xl text-secondary text-center mb-12">Le Nostre Attività</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <Music className="w-12 h-12 mx-auto text-primary" />
              <h3 className="font-display text-2xl">Eventi Culturali</h3>
              <p className="text-secondary/80">
                Concerti, serate di jazz, spettacoli teatrali e performance artistiche inclusive
              </p>
            </div>
            <div className="text-center space-y-4">
              <BookOpen className="w-12 h-12 mx-auto text-primary" />
              <h3 className="font-display text-2xl">Workshop</h3>
              <p className="text-secondary/80">
                Laboratori creativi, corsi di lingua dei segni (LIS), e attività sensoriali
              </p>
            </div>
            <div className="text-center space-y-4">
              <Users2 className="w-12 h-12 mx-auto text-primary" />
              <h3 className="font-display text-2xl">Incontri Sociali</h3>
              <p className="text-secondary/80">
                Aperitivi multiculturali, cene al buio, e eventi di sensibilizzazione
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atmosphere Section */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-12">La Nostra Atmosfera</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 text-white/90">
              <p className="leading-relaxed text-balance">
                L'Altro Spazio è più di un semplice locale - è un luogo dove si respira aria di normalità. 
                Il nostro spazio è completamente accessibile, con un'attenzione particolare alle esigenze di tutti.
              </p>
              <p className="leading-relaxed text-balance">
                Dal bancone abbassato per accogliere persone in sedia a rotelle, ai menu in braille, 
                fino al nostro staff multilingue che include la lingua dei segni (LIS), ogni dettaglio 
                è pensato per creare un ambiente veramente inclusivo.
              </p>
              <p className="leading-relaxed text-balance">
                Il nostro staff è composto al 50% da persone con disabilità, tutti formati per garantire 
                un'esperienza accogliente per ogni visitatore.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/lovable-uploads/6b712eaa-d82a-4ff9-8967-44ea220cc5b8.png"
                alt="Atmosfera accogliente del locale"
                className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
              <img 
                src="/lovable-uploads/d6afc5c1-4ee3-4e9a-a069-43e716869757.png"
                alt="Il nostro bar accessibile"
                className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center md:text-left">
              <Calendar className="w-8 h-8 mb-4 text-primary mx-auto md:mx-0" />
              <h3 className="font-display text-xl mb-2">Eventi e Programmi</h3>
              <p className="text-secondary/80 mb-6">
                Mostre d'arte, workshop, concerti e serate danzanti.
                Ogni evento è pensato per essere accessibile a tutti.
              </p>
            </div>
            <div className="text-center md:text-left">
              <MapPin className="w-8 h-8 mb-4 text-primary mx-auto md:mx-0" />
              <h3 className="font-display text-xl mb-2">Dove Siamo</h3>
              <p className="text-secondary/80">
                Via Nazario Sauro
                <br />
                Bologna, Italia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8">
        <div className="container text-center">
          <img 
            src="/lovable-uploads/9ed77f9f-124b-4d91-8f31-f24528927836.png"
            alt="L'Altro Spazio"
            className="w-40 mx-auto mb-4"
          />
          <p className="text-white/80 mb-4">
            Un luogo dove la diversità è celebrata e l'inclusione è la normalità
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-accent transition-colors">Facebook</a>
            <a href="#" className="hover:text-accent transition-colors">Instagram</a>
            <a href="#" className="hover:text-accent transition-colors">TripAdvisor</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
