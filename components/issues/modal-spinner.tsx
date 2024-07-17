import { TailSpin } from "react-loader-spinner";

function ModalSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-md">
        <TailSpin height="28" width="28" color="black" ariaLabel="loading" />
      </div>
    </div>
  );
}

export default ModalSpinner;
