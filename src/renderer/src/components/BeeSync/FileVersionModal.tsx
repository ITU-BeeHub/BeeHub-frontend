// FileVersionModal.tsx
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "../ui/button";
import DiffViewer from 'react-diff-viewer-continued';

interface FileVersionModalProps {
  courseName: string;
  fileName: string;
  versions: any[];
  closeModal: () => void;
}


const FileVersionModal: React.FC<FileVersionModalProps> = ({
  courseName,
  fileName,
  versions,
  closeModal,
}) => {
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(
    versions.length - 1
  );
  const [compareWithIndex, setCompareWithIndex] = useState(
    versions.length - 2 >= 0 ? versions.length - 2 : versions.length - 1
  );

  const oldContent = versions[compareWithIndex]?.content || "";
  const newContent = versions[selectedVersionIndex]?.content || "";

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 mt-20 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {courseName} - {fileName}
                </Dialog.Title>
                <div className="flex space-x-4">
                  {/* Versions List */}
                  <div className="w-1/4 border-r overflow-y-auto max-h-96">
                    {versions.map((version: any, index: number) => (
                      <div
                        key={version.id}
                        className={`p-2 cursor-pointer ${
                          selectedVersionIndex === index ? "bg-gray-200" : ""
                        }`}
                        onClick={() => {
                          setCompareWithIndex(selectedVersionIndex);
                          setSelectedVersionIndex(index);
                        }}
                      >
                        Version {version.version} - {version.date}
                      </div>
                    ))}
                  </div>
                  {/* Diff Viewer */}
                  <div className="w-3/4 p-2 overflow-auto max-h-96">
                    <h4 className="font-semibold mb-2">
                      Comparing Version {versions[compareWithIndex]?.version} with Version{" "}
                      {versions[selectedVersionIndex]?.version}
                    </h4>
                    <DiffViewer
                      oldValue={oldContent}
                      newValue={newContent}
                      splitView={true}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button className="bg-[#0372CE] text-white" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FileVersionModal;
