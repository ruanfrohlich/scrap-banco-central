import type { IUpdaterObject } from 'types';

export const UpdaterModal = ({
  details,
  onClose,
}: {
  details: IUpdaterObject;
  onClose: () => void;
}) => {
  return (
    <div className="fixed z-[999] w-full h-full bg-[rgba(0,0,0,0.2)]">
      <div className="flex flex-col justify-center items-center no-scrollbar absolute shadow-xl top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 w-[300px] h-[300px] rounded-2xl bg-white overflow-visible">
        <button
          onClick={onClose}
          className="absolute cursor-pointer flex justify-center items-center font-extrabold top-[-10] right-[-10] rounded-full w-[30] h-[30] bg-red-600 hover:scale-[1.2] transition shadow-2xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={10}
            height={10}
            viewBox="0 0 30 30"
          >
            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
          </svg>
        </button>
        <h2 className="font-bold">Nova versão disponível!</h2>

        <div className="p-3 flex items-center">
          <span className="font-bold text-white bg-red-600 rounded-2xl py-1 px-3">
            {details.version}
          </span>
          <span className="block m-5 w-[16] h-[15] rotate-180 [&>svg]:w-full [&>svg]:h-full">
            <svg
              viewBox="0 0 16 15"
              xmlns="http://www.w3.org/2000/svg"
              fill="#2A2A2A"
            >
              <path d="M3.18975 8.2001L8.99478 14.0051L8.00483 14.9951L1.00483 7.99508C0.731463 7.72171 0.731463 7.27849 1.00483 7.00513L8.00483 0.00512695L8.99478 0.995076L3.18975 6.8001H15.4998V8.2001H3.18975Z" />
            </svg>
          </span>
          <span className="font-bold text-white bg-green-600 rounded-2xl py-1 px-3">
            {details.version}
          </span>
        </div>

        <button
          onClick={window.electronAPI.quitApp}
          className="rounded-2xl bg-blue-500 text-white py-1 px-3 cursor-pointer hover:bg-green-400 transition"
        >
          Atualizar
        </button>
      </div>
    </div>
  );
};
