import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Erreur capturée :', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f1117] flex items-center
          justify-center p-6 text-center">
          <div>
            <p className="text-4xl mb-3">⚠️</p>
            <h1 className="text-white text-lg font-bold mb-2">
              Une erreur est survenue
            </h1>
            <p className="text-gray-400 text-sm mb-4 break-all">
              {this.state.error?.message || 'Erreur inconnue'}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-5 py-2.5
                rounded-xl text-sm font-medium">
              Retour au dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}