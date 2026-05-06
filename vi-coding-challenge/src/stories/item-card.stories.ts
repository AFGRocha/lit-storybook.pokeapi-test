import { html } from "lit";
import "../item-card";

export default {
  title: "ItemCard",
  component: "item-card",
  args: {
    title: "Pikachu",
    description: [
      { name: "Electric", index: 13 }
    ],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    entry: "25",
    showImages: true,
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "object" },
    image: { control: "text" },
    entry: { control: "text" },
    showImages: { control: "boolean" },
  },
};

export const Default = (args: any) => html`
  <item-card 
    .title=${args.title}
    .description=${args.description}
    .image=${args.image}
    .entry=${args.entry}
    ?showImages=${args.showImages}
  ></item-card>
`;

export const MultipleTypes = (args: any) => html`
  <item-card 
    .title=${"Charizard"}
    .description=${[
      { name: "Fire", index: 10 },
      { name: "Flying", index: 3 }
    ]}
    .image=${"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"}
    .entry=${"6"}
    ?showImages=${args.showImages}
  ></item-card>
`;

export const WithoutImages = (args: any) => html`
  <item-card 
    .title=${args.title}
    .description=${args.description}
    .image=${args.image}
    .entry=${args.entry}
    ?showImages=${false}
  ></item-card>
`;
