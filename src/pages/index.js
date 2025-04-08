// pages/index.js
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Professional Text-to-Speech Web App | TTS Web App</title>
        <meta
          name="description"
          content="Convert your text to lifelike speech with our cutting-edge Text-to-Speech web app. Perfect for content creators, educators, and businesses."
        />
        <meta
          name="keywords"
          content="Text to Speech, TTS, Speech Synthesis, Web App, Audio, Professional TTS"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">TTS Web App</h1>
              <p className="mt-2 text-lg">Your Professional Text-to-Speech Solution</p>
            </div>
            <nav className="mt-4 md:mt-0">
              <Link href="/tts" legacyBehavior>
                <a className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
                  Try TTS
                </a>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Bring Your Text to Life</h2>
            <p className="text-xl text-gray-700">
              Transform any text into clear, engaging speech using state-of-the-art technology.
              Perfect for multimedia content, e-learning, presentations, and more.
            </p>
          </section>

          {/* Features Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">High-Quality Audio</h3>
              <p className="text-gray-600">
                Enjoy natural and engaging voice synthesis with multiple language and voice options.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-600">
                Seamlessly integrate our API into your applications for a fast, reliable experience.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-2">Scalable & Secure</h3>
              <p className="text-gray-600">
                Our cloud-based infrastructure ensures high scalability and top-notch security.
              </p>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="bg-blue-50 rounded-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-center mb-4">Why Choose Our TTS Web App?</h2>
            <p className="text-gray-700 text-center max-w-2xl mx-auto">
              Designed for professionals, our Text-to-Speech web app delivers reliable, high-quality speech synthesis that empowers content creators, educators, and businesses. Experience the perfect balance of advanced technology and ease-of-use.
            </p>
          </section>

          {/* Call-to-Action */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-gray-700 mb-6">
              Ready to transform your text into dynamic audio content? Dive in and experience the power of advanced text-to-speech technology.
            </p>
            <Link href="/tts" legacyBehavior>
              <a className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Convert Your Text Now
              </a>
            </Link>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 text-gray-700 py-6">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} TTS Web App. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
