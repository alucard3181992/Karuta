import React from "react";

const WorkerDetailsDisplay = ({ workerData }) => {
  if (!workerData) {
    return <p>No hay datos para mostrar.</p>;
  }

  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <h3>Detalles del Worker</h3>
        {console.log(workerData)}
        <p>
          <strong>Character:</strong> {workerData.characterDetails}
        </p>
        <p>
          <strong>Card Code:</strong> {workerData.cardCode}
        </p>
        <p>
          <strong>Effort:</strong> {workerData.effort}
        </p>
        <p>
          <strong>Health Status:</strong> {workerData.healthStatus}
        </p>
      </div>
      <div className="col-12 md:col-6 text-center">
        <p className="font-bold">Effort Modifiers</p>
        <table
          cellPadding="3"
          style={{ borderRadius: "4px" }}
          className="surface-0 w-full p-2"
        >
          <tbody>
            {Object.entries(workerData.effortModifiers).map(
              ([key, modifier]) => (
                <tr key={key}>
                  <td className="text-blue-300">{modifier.value}</td>
                  <td>{modifier.grade}</td>
                  <td className="text-purple-300">{key}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerDetailsDisplay;
