import BoxReveal from "@/components/magicui/box-reveal";

export async function BoxRevealDemo() {
  return (
    <div className="p-2 md:p-0 h-full max-w-[20rem] md:max-w-[32rem] items-start justify-start overflow-hidden pt-8 mx-auto">
      <BoxReveal boxColor={"#b6cfff"} duration={0.5}>
        <p className="text-[2.5rem] md:text-[3.5rem] font-semibold">
          Älyä Avustaja<span className="text-[#5046e6]">.</span>
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#b6cfff"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem] md:text-[1.5rem]">
          Huolto ja hoito-ohjeita tarjoava{" "}
          <span className="text-[#5046e6]">Tekoäly sovellus</span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#b6cfff"} duration={0.5}>
        <div className="mt-[1.5rem] text-[0.875rem] md:text-[1rem]">
          <p>
            {/* -&gt; Toteutettu yhteistyössä:
            <span className="font-semibold text-[#5046e6]"> Huoltoyhtiö Piiroisen</span>, 
            <span className="font-semibold text-[#5046e6]"> Helsingin kaupungin</span>, ja
            <span className="font-semibold text-[#5046e6]"> Haaga-Helian kanssa</span>. */}
            {/* <br /> */}
            {/* -&gt; Integroitu Lunni-järjestelmään. <br /> */}
            -&gt; Sovelluksessa voit tarkistella huoltokohteen vikailmoituksia ja täydentää niitä sekä käyttää tekoälyä hyödyksi etsiessäsi huonekalujen huolto-ohjeita. <br />
          </p>
        </div>
      </BoxReveal>
    </div>
  );
}