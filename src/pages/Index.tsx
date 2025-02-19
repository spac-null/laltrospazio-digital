
import { useState } from "react";
import { Wine, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center parallax-bg" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80')",
        }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 text-center animate-fade-up">
          <h1 className="font-display text-5xl md:text-7xl text-white mb-6">L'Altro Spazio</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
            Un luogo dove cultura e convivialità si incontrano
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
            onClick={() => setIsMenuOpen(true)}
          >
            Scopri il Menu
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl text-secondary mb-8">La Nostra Storia</h2>
            <p className="text-lg text-secondary/80 leading-relaxed mb-8">
              Situato nel cuore di Bologna, L'Altro Spazio è più di un semplice bar. 
              È un luogo di incontro dove arte, cultura e sapori si fondono per creare 
              un'esperienza unica. Dal 2020, abbiamo creato uno spazio dove la 
              comunità può riunirsi, condividere idee e godersi momenti speciali.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="section-padding bg-secondary text-white">
        <div className="container">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-12">I Nostri Signature</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Negroni Bolognese",
                description: "Una twist sul classico, con bitter artigianale",
                price: "€10",
              },
              {
                name: "Spritz all'Altro",
                description: "Il nostro spritz speciale con prosecco selezionato",
                price: "€8",
              },
              {
                name: "Martini Emiliano",
                description: "Gin locale, vermouth artigianale, olive nostrane",
                price: "€12",
              },
            ].map((drink) => (
              <Card key={drink.name} className="glass-card p-6 text-center">
                <Wine className="w-8 h-8 mx-auto mb-4 text-accent" />
                <h3 className="font-display text-xl mb-2">{drink.name}</h3>
                <p className="text-white/80 mb-4">{drink.description}</p>
                <p className="text-accent font-semibold">{drink.price}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="font-display text-xl mb-2">Orari</h3>
              <p className="text-secondary/80">
                Mar - Dom: 18:00 - 02:00
                <br />
                Lunedì: Chiuso
              </p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="font-display text-xl mb-2">Dove Siamo</h3>
              <p className="text-secondary/80">
                Via dell'Indipendenza, 71
                <br />
                40121 Bologna, Italia
              </p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="font-display text-xl mb-2">Prenotazioni</h3>
              <p className="text-secondary/80">
                Tel: +39 051 123 4567
                <br />
                info@altrospazio.it
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <div className="container">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-12">Atmosfera</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
            ].map((img, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src={img} 
                  alt={`L'Altro Spazio atmosphere ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-8">
        <div className="container text-center">
          <h2 className="font-display text-2xl mb-4">L'Altro Spazio</h2>
          <p className="text-white/80 mb-4">
            Un posto diverso per persone speciali
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
