import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { PartyItem } from "../components/PartyItem";
import { useParties } from "../hooks/useParties";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Votos por Partido Político",
      color: "white",
      font: { size: 16 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Cantidad de votos",
        color: "rgba(255, 255, 255, 0.7)",
      },
      ticks: { color: "rgba(255, 255, 255, 0.7)" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
    x: {
      title: {
        display: true,
        text: "Partidos Políticos",
        color: "rgba(255, 255, 255, 0.7)",
        font: { size: 16, weight: 600 },
      },
      ticks: { color: "rgba(255, 255, 255, 0.7)" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
  },
};

export const HomePage = () => {
  const {
    status,
    parties,
    chartData,
    addParty,
    removeParty,
    updatePartyName,
    updateVotes,
  } = useParties();
  return (
    <div className="chart-container">
      <h1>Resultados Electorales</h1>
      <h3>Conexión: {status}</h3>

      <div className="chart-wrapper">
        <Bar options={chartOptions} data={chartData} />
      </div>

      <div className="controls-section">
        <div className="controls-header">
          <h2>Configuración de partidos</h2>
          <button className="btn-add" onClick={addParty}>
            + Agregar partido
          </button>
        </div>

        <div className="party-list">
          {parties.map((party) => (
            <PartyItem
              key={party.id}
              party={party}
              onNameChange={(newName) => updatePartyName(party.id, newName)}
              onVotesChange={updateVotes}
              onRemove={() => removeParty(party.id)}
              canRemove={parties.length > 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
