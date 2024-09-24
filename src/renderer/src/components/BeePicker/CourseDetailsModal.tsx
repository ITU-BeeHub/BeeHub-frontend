import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "../ui/button";

interface CourseDetailsModalProps {
    isOpen: boolean;
    closeModal: () => void;
    course: any | null;  // Adjust to accept the transformed course type
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
    isOpen,
    closeModal,
    course,
}) => {
    if (!course) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {course.name}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        <strong>CRN:</strong> {course.crn}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Day:</strong> {course.day}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Time:</strong> {course.startTime} - {course.endTime}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Instructor:</strong> {course.instructor}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Building:</strong> {course.building}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Room:</strong> {course.room}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Enrolled/Capacity:</strong> {course.enrolled}/{course.capacity}
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={closeModal}
                                    >
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

export default CourseDetailsModal;
