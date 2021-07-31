<template>
  <div
    v-if="assetType === 'OccultaNovelliaCharacter'"
    class="character"
  >
    <p class="charater__description">
      {{ asset.description }}
    </p>
    <table>
      <tr>
        <th>Card Number</th>
        <th>Release Set</th>
        <th>Rarity</th>
      </tr>
      <tr>
        <td> {{ asset.card.number }} </td>
        <td> {{ asset.card.release_set }} </td>
        <td> {{ asset.card.rarity }} </td>
      </tr>
    </table>
    <table>
      <tr>
        <th>Attributes</th>
        <th>Class</th>
        <th>Stage</th>
        <th v-if="asset.stats.slots">
          Slots
        </th>
      </tr>
      <tr>
        <td class="character__attributes"> 
          <p
            v-for="attr in asset.attributes"
            :key="attr"
          >
            - {{ attr }}
          </p>
        </td>
        <td valign="top">
          {{ asset.progression.class }}
        </td>
        <td valign="top">
          {{ asset.progression.stage }}
        </td>
        <td
          v-if="asset.stats.slots"
          valign="top"
        >
          {{ asset.stats.slots }}
        </td>
      </tr>
    </table>
    <table>
      <tr>
        <th
          v-for="label in assetLabels"
          :key="label"
        >
          {{ label }}
        </th>
      </tr>
      <tr>
        <td
          v-for="stat in assetStats"
          :key="stat"
        >
          {{ stat }}
        </td>
      </tr>
    </table>
    <canvas
      id="statsChart"
      width="100"
      height="100"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  props: {
    assetType: {
      type: String,
      required: true
    },
    asset: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  setup(props) {
    
    const assetLabels = ref(Object.keys(props.asset.stats).map(label => {
      return label[0].toUpperCase() + label.slice(1);
    }));
    const assetStats = ref(Object.values(props.asset.stats));
    if(assetLabels.value.includes("Slots")) {
      assetLabels.value.pop();
      assetStats.value.pop();
    }
    const assetStatsMax = [30, 20, 4];
    const assetStatsNormalized = assetStats.value.map((stat, index) => {
      return stat / assetStatsMax[index];
    });
    onMounted(() => {
      const ctx = document.getElementById("statsChart").getContext("2d");
      const chartData = {
        labels: assetLabels.value,
        datasets: [{
          label: "Stats",
          data: assetStatsNormalized,
          fill: true,
          backgroundColor: "rgba(154, 18, 179, 0.2)",
          borderColor: "rgba(154, 18, 179)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(154, 18, 179)",
          pointBorderColor: "rgba(102, 51, 153)",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(154, 18, 179)"
        }]
      };
      const config = {
        type: "radar",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false
            }
          },
          scales: {
            r: {
              backgroundColor: "#282828",
              min: 0,
              max: 1,
              ticks: {
                display: false,
                maxTicksLimit: 5
              },
              angleLines: {
                color: "rgba(255, 255, 255, 0.87)",
                lineWidth: 0.3
              },
              pointLabels: {
                color: "rgba(255, 255, 255, 0.87)",
                font: {
                  size: 18
                }
              },
              grid: {
                lineWidth: 0.3,
                color: "rgba(255, 255, 255, 0.87)"
              }
            }
          }
        },
        
      };
      new Chart(ctx, config);
    });

    return { assetLabels, assetStats };
  }
};
</script>

<style lang="scss" scoped>

.character {
  display: flex;
  flex-flow: column nowrap;
}

.character__description {
  font-size: inherit;
  margin-top: 10px;
  color: $high-emphasis-text;
}

.character__attributes {
  display: flex;
  flex-flow: column nowrap;
}

#statsChart {
  margin-top: 20px;
}

table {
  margin-top: 25px;
  text-align: center;
  border-collapse: collapse;
  width: 100%;
  
}
th {
  color: $low-emphasis-text;
  border-bottom: thin solid $primary-dark-3;
  padding: 5px;
}
td {
  font-size: 1rem;
  padding: 3px;
}
h2 {
  color: $low-emphasis-text;
  border-bottom: thin solid $primary-dark-3;
  padding: 5px;
  margin-bottom: 10px;
}


</style>
