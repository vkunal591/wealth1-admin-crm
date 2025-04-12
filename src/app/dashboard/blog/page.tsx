"use client";

import useFetch from "@/hooks/useFetch";
import { endpoints } from "@/data/endpoints";
import AuthGuard from "@/components/AuthGuard";
import Loader from "@/components/common/Loader";
import Wrapper from "@/components/common/Wrapper";
import React, { useEffect, useState } from "react";
import { Delete, Fetch, Post, Put } from "@/hooks/apiUtils";
import { toast } from "react-toastify";
import Modal from "@/components/common/Modal";
import ConfirmationModal from "@/components/crud/ConfirmationModal";
import ContentBlockComponent from "../home/components/ContentBlock";
import CourseContentList from "../home/components/CourseContentList";

interface SubContent {
  _id: number;
  title: string;
  description: string;
  image?: File | null;
}

interface ContentBlock {
  _id: number;
  title: string;
  subtitle: string;
  description: string;
  media?: File | null;
  subContents: SubContent[];
}

const Blog: React.FC = () => {
  const { data, loading } = useFetch(endpoints["Blog"].fetchAll);
  const [contentList, setContentList] = useState<ContentBlock[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentBlock | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectIdForDeletion, setSelectIdForDeletion] = useState<string>("");

  useEffect(() => {
    if (data && data?.data?.result && data?.data?.result?.length)
      setContentList(data?.data?.result ?? []);
  }, [data]);

  // Add or Update Content
  const handleSave = async (content: any, id: any) => {
    try {
      let url = "";
      if (id) url = `${endpoints["Blog"].update}${id}`;
      else url = `${endpoints["Blog"].create}`;

      const response: any = id
        ? await Put(url, content)
        : await Post(url, content);

      if (response.success) {
        const fetchUrl = `${endpoints["Blog"].fetchAll}`;
        const resp: any = await Fetch(fetchUrl, {}, 5000, true, false);
        if (resp?.success && resp?.data?.result.length > 0)
          setContentList(resp?.data?.result);
        setShowForm(false);
        setSelectedContent(null);
      } else return toast.error(response?.message ?? "Error!");
    } catch (error) {
      console.log("Error: " + error);
    } finally {
    }
  };

  // Edit Content
  const handleEdit = (content: ContentBlock) => {
    setSelectedContent(content);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      setSelectIdForDeletion(id);
      if (!showDeleteModal) return setShowDeleteModal(true);
      const deleteEndpoint = endpoints["Blog"]?.delete;
      const fetchEndpoint = endpoints["Blog"]?.fetchAll;

      if (deleteEndpoint && fetchEndpoint) {
        await Delete(`${deleteEndpoint}${id}`);
        const response: any = await Fetch(fetchEndpoint, {}, 5000, true, false);
        if (response?.success) {
          setShowForm(false);
          setSelectedContent(null);
          setShowDeleteModal(false);
          setContentList(response?.data?.result);
        } else window.location.reload();
      }
    } catch (error) {
      console.log("Handle Delete", error);
    }
  };

  const handleDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <AuthGuard>
      <Wrapper>
        <div className="">
          <Modal
            width="w-fit"
            isVisible={showDeleteModal}
            onClose={handleDeleteModal}
          >
            <ConfirmationModal
              id={selectIdForDeletion}
              handleDelete={handleDelete}
              handleDeleteModal={handleDeleteModal}
            />
          </Modal>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">Blog Content</h2>
            <button
              onClick={() => {
                setShowForm(true);
                setSelectedContent(null);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              + Add New Section
            </button>
          </div>
          {showForm && (
            <ContentBlockComponent
              slug="blog"
              uploadType="image"
              section="Sub Content"
              title="Banner Section"
              initialData={selectedContent}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setSelectedContent(null);
              }}
            />
          )}

          {/* List of Content Blocks */}
          {loading ? (
            <Loader />
          ) : (
            !showForm && (
              <div className="mt-6 bg-white rounded-xl pb-4">
                {contentList.length > 0 ? (
                  contentList.map((content: any) => {
                    return (
                      <React.Fragment key={content?._id}>
                        <CourseContentList
                          data={content}
                          handleEdit={handleEdit}
                          handleDelete={handleDelete}
                        />
                      </React.Fragment>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No content available.</p>
                )}
              </div>
            )
          )}
        </div>
      </Wrapper>
    </AuthGuard>
  );
};

export default Blog;
