import { useState } from "react";
import { Users, Palette, Calendar, MapPin, Phone, Heart, Music, BookOpen, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { venue } from "@/lib/content";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center parallax-bg" 
        style={{
          backgroundImage: "url('/uploads/6z712EAa-982a-4fk9-8943-44ea220cc5b8.jpg')",
        }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 text-center animate-fade-up">
        <img 
            src="/uploads/2fcacb8b-60d7-40db-8f43-cbd19d7f0b9f.png"
            alt="L'Altro Spazio"
            className="w-48 md:w-64 mx-auto mb-8 object-contain object-fit"
          />
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light max-w-3xl mx-auto text-balance">
            Uno spazio culturale dove tutti si sentono sicuri, rispettati e inclusi
          </p>
{/* Button removed */}
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

      {/* Activities Section - Enhanced */}
      <section className="section-padding bg-white">
        <div className="container">
          <h2 className="font-display text-4xl md:text-5xl text-secondary text-center mb-12">Le Nostre Attività</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="text-center space-y-4 hover:transform hover:scale-105 transition-all duration-300 p-6 rounded-lg hover:shadow-md">
              <Music className="w-12 h-12 mx-auto text-primary" />
              <h3 className="font-display text-2xl">Eventi Culturali</h3>
              <p className="text-secondary/80">
                Concerti, serate di jazz, spettacoli teatrali e performance artistiche inclusive
              </p>
              <ul className="text-left text-secondary/80 mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Esibizioni di musica dal vivo con interpreti LIS</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Spettacoli teatrali con audiodescrizione</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Letture poetiche multilingue</span>
                </li>
              </ul>
            </div>
            <div className="text-center space-y-4 hover:transform hover:scale-105 transition-all duration-300 p-6 rounded-lg hover:shadow-md">
              <BookOpen className="w-12 h-12 mx-auto text-primary" />
              <h3 className="font-display text-2xl">Mostre d'Arte</h3>
              <p className="text-secondary/80">
                Esposizioni artistiche accessibili e inclusive che celebrano la diversità e la creatività
              </p>
              <ul className="text-left text-secondary/80 mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Mostre tattili per persone non vedenti</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Esposizioni di artisti emergenti locali</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Installazioni artistiche multisensoriali</span>
                </li>
              </ul>
            </div>
            <div className="text-center space-y-4 hover:transform hover:scale-105 transition-all duration-300 p-6 rounded-lg hover:shadow-md">
              <Users2 className="w-12 h-12 mx-auto text-primary" />
              <h3 className="font-display text-2xl">Incontri Sociali</h3>
              <p className="text-secondary/80">
                Aperitivi multiculturali, cene al buio, e eventi di sensibilizzazione
              </p>
              <ul className="text-left text-secondary/80 mt-4 space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Cene al buio con guide non vedenti</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Aperitivi sociali con traduzione LIS</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Incontri di sensibilizzazione sull'inclusione</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Instagram Call-to-Action */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => window.open(venue.social_profiles.instagram, '_blank')}
            >
              Seguici su Instagram per vedere le nostre attività
            </Button>
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
                un'esperienza accogliente per ogni visitatore. Siamo orgogliosi di aver integrato con successo
                oltre 20 persone senza precedente esperienza lavorativa nel mercato del lavoro.
              </p>
              
              {/* Testimonials - New */}
              <div className="mt-8 bg-white/10 p-6 rounded-lg">
                <h3 className="font-display text-2xl text-white mb-4">Cosa Dicono i Nostri Ospiti</h3>
                <div className="space-y-4">
                  <blockquote className="italic border-l-2 border-primary pl-4 py-2">
                    "Finalmente un posto dove mia sorella sorda può partecipare pienamente agli eventi culturali senza sentirsi esclusa."
                    <footer className="text-white/70 text-sm mt-2">— Maria C.</footer>
                  </blockquote>
                  <blockquote className="italic border-l-2 border-primary pl-4 py-2">
                    "La cena al buio è stata un'esperienza che ha cambiato la mia prospettiva. Consiglio a tutti di partecipare almeno una volta!"
                    <footer className="text-white/70 text-sm mt-2">— Paolo R.</footer>
                  </blockquote>
                  <blockquote className="italic border-l-2 border-primary pl-4 py-2">
                    "L'Altro Spazio non è solo un locale, è una comunità che ti fa sentire parte di qualcosa di importante. L'inclusività qui non è solo una parola, è praticata ogni giorno."
                    <footer className="text-white/70 text-sm mt-2">— Giulia M.</footer>
                  </blockquote>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="/uploads/LAltro_Spazio_PV-20.jpg"
                  alt="Atmosfera accogliente del locale"
                  className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                <img 
                  src="/uploads/LAltro_Spazio_PV-30.jpg"
                  alt="Il nostro bar accessibile"
                  className="rounded-lg object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Impact Stats - New */}
              <div className="bg-white/10 p-6 rounded-lg mt-6">
                <h3 className="font-display text-2xl text-white mb-6 text-center">Il Nostro Impatto</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-primary mb-2">50+</span>
                    <span className="text-white/80">Eventi inclusivi all'anno</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-primary mb-2">15+</span>
                    <span className="text-white/80">Tirocinanti distanti dal mercato del lavoro</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-primary mb-2">15+</span>
                    <span className="text-white/80">Collaborazioni con associazioni</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-4xl font-bold text-primary mb-2">20+</span>
                    <span className="text-white/80">Persone integrate nel mercato del lavoro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* Contact Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Calendar className="w-8 h-8 mb-4 text-primary mx-auto" />
              <h3 className="font-display text-xl mb-2">Programmi</h3>
              <p className="text-secondary/80">
                Mostre d'arte, concerti, presentazioni e incontri.
                <br />
                Ogni evento è pensato per accessibile a tutti.
                <br />
                <Button 
                  variant="ghost" 
                  className="mt-4 text-primary hover:text-accent" 
                  onClick={() => window.open(venue.social_profiles.instagram, '_blank')}
                >
                  Esplora su Instagram
                </Button>
              </p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 mb-4 text-primary mx-auto" />
              <h3 className="font-display text-xl mb-2">Contattaci</h3>
              <p className="text-secondary/80">
                WhatsApp: {venue.phone}
              </p>
                <Button 
                variant="ghost" 
                className="mt-4 text-primary hover:text-accent" 
                onClick={() => window.open('https://wa.me/message/CJWYXW3ILGFCL1', '_blank')}
              >
                  Contatta via WhatsApp
                </Button>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 mb-4 text-primary mx-auto" />
              <h3 className="font-display text-xl mb-2">Dove Siamo</h3>
              <p className="text-secondary/80">
                {venue.address}
              </p>              
              <Button 
                  variant="ghost" 
                  className="mt-4 text-primary hover:text-accent" 
                  onClick={() => window.open(venue.map_profile.url, '_blank')}
                >
                  Trova la strada con Google Maps
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8">
        <div className="container text-center">
          <img 
            src="/uploads/2fcacb8b-60d7-40db-8f43-cbd19d7f0b9f.png"
            alt="L'Altro Spazio"
            className="w-40 mx-auto mb-4 brightness-100"
          />
          <p className="text-white/80 mb-4">
            Un luogo dove la diversità è celebrata e l'inclusione è la normalità
          </p>
          <div className="flex justify-center space-x-4">
<a href={venue.social_profiles.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Facebook</a>
<a href={venue.social_profiles.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Instagram</a>
<a href={venue.social_profiles.tripadvisor} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">TripAdvisor</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
