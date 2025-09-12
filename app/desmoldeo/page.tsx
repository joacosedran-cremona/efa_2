import DatosLaterales from "@/components/desmoldeoLayout/datosLaterales";
import Productividad from '@/components/desmoldeoLayout/productividad/productividad';
//import FiltroPeriodoGraficos from '@/components/filtroperiodo/FiltroPeriodoGraficos';
import Layout from "@/components/desmoldeoLayout/layout/layout";

function Desmoldeo() {
  return (
    <>
      <DatosLaterales />
      <div className="flex flex-col w-full p-5 gap-5">
        <section id="section1" className="">
          <Layout />
        </section>

        <section id="section2" className="">
          <Productividad />
        </section>
        
        {/*
            <section id="section3" className="">
                <FiltroPeriodoGraficos />
            </section>
          */}
      </div>
    </>
  );
}

export default Desmoldeo;
