
import ChatWidget from '@/components/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <img 
              src="https://wordpress.techrealm.online/images/97a08179-1527-41b3-b8ff-0f681c89e043.png" 
              alt="DSM Logo" 
              className="w-24 h-24 mx-auto mb-6 object-contain"
            />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              TechRealm Support
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get instant help with your software questions. Our AI-powered chat widget is here to assist you 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Support</h3>
              <p className="text-gray-600">Get immediate assistance with your software queries through our intelligent chat system.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Access support from any device with our responsive chat widget design.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Knowledge</h3>
              <p className="text-gray-600">Our AI is trained on comprehensive software documentation and best practices.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold mb-1">Start Chat</h4>
                  <p className="text-sm text-gray-600">Click the chat widget and enter your email and software query.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold mb-1">Ask Questions</h4>
                  <p className="text-sm text-gray-600">Type your questions and get instant, accurate responses.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold mb-1">Get Solutions</h4>
                  <p className="text-sm text-gray-600">Receive detailed solutions and guidance for your software needs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Ready to get started?</p>
            <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
              <span>Look for the chat widget on the left side of your screen</span>
              <span className="animate-pulse">👈</span>
            </div>
          </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
};

export default Index;
