import DatosLaterales from "@/components/desmoldeoLayout/datosLaterales";
import Productividad from "@/components/desmoldeoLayout/productividad/productividad";
import FiltradoFechasGraph from "@/components/desmoldeoLayout/graficos/filtradoFechasGraph";
import Layout from "@/components/desmoldeoLayout/layout/layout";

function Desmoldeo() {
  return (
    <>
      <DatosLaterales />
      <div className="flex flex-col w-full p-5 gap-5">
        <section className="" id="section1">
          <Layout />
        </section>

        <section className="" id="section2">
          <Productividad />
        </section>

        <section className="" id="section3">
          <FiltradoFechasGraph />
        </section>
      </div>
    </>
  );
}

export default Desmoldeo;
