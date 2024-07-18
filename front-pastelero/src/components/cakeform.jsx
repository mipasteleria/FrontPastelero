import { useState } from "react";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const CakeForm = () => {
  const cakeFlavor = [
    "Bizcocho de Vainilla",
    "Bizcocho de Chocolate",
    "Bizcocho Red Velvet",
    "Bizcocho de Naranja",
    "Bizcocho Dulce de Leche",
  ];

  const cakeFilling = [
    "Buttercream Vainilla",
    "Buttercream Chocolate",
    "Ganache Chocolate semiamargo",
    "Ganache Chocolate Blanco",
    "Mermelada de blueberry y LemonCurd",
    "Queso Crema",
    "Mermelada Frambuesa",
    "Mermelada Maracuya",
  ];

  const cober = [
    "Buttercream Vainilla",
    "Buttercream Chocolate",
    "Ganache Chocolate semiamargo",
    "Ganache Chocolate Blanco",
  ];

  const cakeDecoreOptions = [
    "Cobertura Buttercream(betun con base en mantequilla)",
    "Cobertura Ganache Base de Chocolate",
    "Forrado de Fondant",
    "Dibujo a mano en Fondant",
    "Dibujo en Buttercream",
    "Flores naturales",
    "Letrero",
    "Impresion comestible",
    "Personajes modelados de azúcar",
    "Pastel 3d de un personaje",
  ];

  const [formData, setFormData] = useState({
    cakeFlavor: "",
    portions: "",
    levels: "",
    cakeFilling: "",
    cober: "",
    fondant: false,
    decorations: [],
    others: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDecorationsChange = (decoration) => {
    setFormData((prevData) => {
      const decorations = prevData.decorations.includes(decoration)
        ? prevData.decorations.filter((item) => item !== decoration)
        : [...prevData.decorations, decoration];
      return {
        ...prevData,
        decorations,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`${poppins.className}`}>
      <div>
        <label>Sabor de Bizcocho</label>
        <select name="cakeFlavor" value={formData.cakeFlavor} onChange={handleInputChange}>
          <option value="">Selecciona un sabor</option>
          {cakeFlavor.map((flavor) => (
            <option key={flavor} value={flavor}>
              {flavor}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Número de Porciones</label>
        <select name="portions" value={formData.portions} onChange={handleInputChange}>
          <option value="">Selecciona el número de porciones</option>
          {[...Array(20)].map((_, i) => (
            <option key={i} value={(i + 1) * 10}>
              {(i + 1) * 10}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Número de Niveles</label>
        <select name="levels" value={formData.levels} onChange={handleInputChange}>
          <option value="">Selecciona el número de niveles</option>
          {[...Array(5)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Sabor del Relleno</label>
        <select name="cakeFilling" value={formData.cakeFilling} onChange={handleInputChange}>
          <option value="">Selecciona el sabor del relleno</option>
          {cakeFilling.map((filling) => (
            <option key={filling} value={filling}>
              {filling}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Cobertura</label>
        <select name="cober" value={formData.cober} onChange={handleInputChange}>
          <option value="">Selecciona la cobertura</option>
          {cober.map((cover) => (
            <option key={cover} value={cover}>
              {cover}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="fondant"
            checked={formData.fondant}
            onChange={handleInputChange}
          />
          Forrado de Fondant
        </label>
      </div>
      <div>
        <label>Decoración Deseada</label>
        {cakeDecoreOptions.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              name="decorations"
              checked={formData.decorations.includes(option)}
              onChange={() => handleDecorationsChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
      <div>
        <label>Otros</label>
        <input
          type="text"
          name="others"
          value={formData.others}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CakeForm;
