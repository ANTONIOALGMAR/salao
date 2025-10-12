import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';

/**
 * @function HomePage
 * @description Componente da página inicial com um carrossel de imagens de serviços e uma mensagem de boas-vindas.
 * @returns {JSX.Element} O componente React da página inicial.
 */
const HomePage = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    // Inicializa o carrossel Swiper
    swiperRef.current = new Swiper('.swiper-container', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });

    // Cleanup ao desmontar o componente
    return () => {
      if (swiperRef.current && swiperRef.current.destroy) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Carrossel de imagens */}
      <div className="swiper-container h-96 rounded-lg overflow-hidden">
        <div className="swiper-wrapper">
          {/* Slide 1: Cortes Modernos */}
          <div className="swiper-slide relative">
            <img 
              src="https://images.pexels.com/photos/3992870/pexels-photo-3992870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Cortes Modernos"
              className="w-full h-full object-cover"
            />
            <div className="slide-description absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
              <h3 className="text-xl font-bold">Cortes Modernos</h3>
              <p>Nossos estilistas são especialistas em cortes modernos e personalizados.</p>
            </div>
          </div>
          {/* Slide 2: Coloração e Mechas */}
          <div className="swiper-slide relative">
            <img 
              src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Coloração e Mechas"
              className="w-full h-full object-cover"
            />
            <div className="slide-description absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
              <h3 className="text-xl font-bold">Coloração e Mechas</h3>
              <p>Realce sua beleza com nossas técnicas de coloração e mechas.</p>
            </div>
          </div>
          {/* Slide 3: Tratamentos Capilares */}
          <div className="swiper-slide relative">
            <img 
              src="https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Tratamentos Capilares"
              className="w-full h-full object-cover"
            />
            <div className="slide-description absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
              <h3 className="text-xl font-bold">Tratamentos Capilares</h3>
              <p>Recupere a saúde e o brilho dos seus cabelos com nossos tratamentos.</p>
            </div>
          </div>
        </div>
        {/* Paginação do carrossel */}
        <div className="swiper-pagination"></div>
        {/* Botões de navegação do carrossel */}
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>

      {/* Seção de boas-vindas */}
      <section className="text-center py-8">
        <h2 className="text-3xl font-bold mb-4">Bem-vindo ao Salão de Beleza!</h2>
        <p className="text-xl mb-6">Agende seus serviços de beleza favoritos de forma rápida e fácil.</p>
        <Link to="/agendamentos" className="btn btn-primary">
          Agendar Agora
        </Link>
      </section>

      {/* Seção de serviços em destaque */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Nossos Serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Cortes</h3>
            <p className="text-gray-600 mb-4">Cortes modernos e personalizados para todos os estilos.</p>
            <Link to="/servicos" className="text-blue-600 hover:underline">Ver opções →</Link>
          </div>
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Coloração</h3>
            <p className="text-gray-600 mb-4">Transforme seu visual com nossas opções de coloração.</p>
            <Link to="/servicos" className="text-blue-600 hover:underline">Ver opções →</Link>
          </div>
          <div className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Tratamentos</h3>
            <p className="text-gray-600 mb-4">Revitalize seus cabelos com nossos tratamentos especiais.</p>
            <Link to="/servicos" className="text-blue-600 hover:underline">Ver opções →</Link>
          </div>
        </div>
      </section>

      {/* Seção de programa de fidelidade */}
      <section className="py-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-2xl font-bold mb-4">Programa de Fidelidade</h2>
          <p className="mb-4">Acumule pontos a cada visita e troque por descontos e serviços gratuitos!</p>
          <Link to="/cadastro" className="btn btn-primary inline-block">
            Cadastre-se Agora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
