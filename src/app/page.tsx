import CountdownTimer from '@/components/CountdownTimer';
import ParticleBackground from '@/components/ParticleBackground';
import ImageGallery from '@/components/ImageGallery';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Countdown Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-12">
          <CountdownTimer />
        </section>
        
        {/* Gallery Section */}
        <section className="py-16 bg-black/20 backdrop-blur-sm">
          <ImageGallery />
        </section>
      </div>
    </div>
  );
}
