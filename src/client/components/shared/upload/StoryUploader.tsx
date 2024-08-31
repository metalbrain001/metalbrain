import { Button } from '@/components/ui/button';
import {
  useGetUserStoryPreview,
  useUploadUserStory,
} from '@/lib/react-query/upload/UploadQuerys';
import { useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

type UserStoryUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

type FileWithPreview = File & {
  preview: string;
};

const StoryUploader = ({ fieldChange, mediaUrl }: UserStoryUploaderProps) => {
  const [currentFile, setCurrentFile] = useState<FileWithPreview[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [message, setMessage] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [messageColor, setMessageColor] = useState('');
  const [uploading, setUploading] = useState(false);

  const userStoryMutation = useUploadUserStory();
  const storyPreview = useGetUserStoryPreview();
  const navigate = useNavigate();

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      }) as FileWithPreview;
      setCurrentFile([fileWithPreview]);
      setShowPreview(true);
      setFileUrl(fileWithPreview.preview);
      fieldChange([file]);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles.length > 0) {
        const filesWithPreview: FileWithPreview[] = acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setCurrentFile(filesWithPreview);
        setFileUrl(filesWithPreview[0].preview);
        setShowPreview(true);
        fieldChange(acceptedFiles);
        handleStoryUpload(acceptedFiles[0]);
        navigate('/preview-image', { state: { file: acceptedFiles[0] } });
      }
    },
    [fieldChange]
  );

  const handleStoryUpload = async (file: File) => {
    if (currentFile.length === 0) {
      setMessage('Please select a file to upload.');
      setMessageColor('red-500');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await userStoryMutation.mutateAsync({ formData });
      console.log('response:', response?.storyUrl);
      if (response && response?.storyUrl) {
        setFileUrl(response.storyUrl || currentFile[0].preview);
        setMessage(response.message || 'Image uploaded successfully!');
        setMessageColor('green-500');
        setShowPreview(false);
        navigate('/'); // Navigate to the desired page after upload
      } else {
        throw new Error('Upload failed: No data in response');
      }
    } catch (error) {
      console.error('Error uploading story:', error);
      setMessage('Error uploading story. Please try again.');
      setMessageColor('red-500');
    } finally {
      setUploading(false);
    }
  };

  // Fetch the preview image URL for the logged-in user
  useEffect(() => {
    if (imageUploaded) {
      const fetchPreviewImage = async () => {
        try {
          const previewImageUrl = await storyPreview.mutateAsync();
          setFileUrl(previewImageUrl);
        } catch (error) {
          console.error('Error fetching preview story:', error);
          setMessage('Error fetching preview story. Please try again.');
        }
      };

      fetchPreviewImage();
      setImageUploaded(false); // Reset the flag after fetching the image
    }
  }, [imageUploaded, storyPreview]);

  useEffect(() => {
    return () => {
      currentFile.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [currentFile]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
    },
  });

  return (
    <div className="flex flex-center flex-col bg-dark-3 rounded-xl w-full h-auto cursor-pointer">
      <div
        {...getRootProps()}
        className="flex-center flex-col cursor-pointer w-full"
      >
        {/* DropZone Area*/}
        <input
          {...getInputProps()}
          id="fileInput"
          type="file"
          formMethod="POST"
          name="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              selectFile(e);
            }
          }}
          className="cursor-pointer"
        />
        <div className="cursor-pointer flex-center gap-4">
          <img
            src={fileUrl || '/assets/icons/camera.svg'}
            alt="story-preview"
            className="max-h-[600px] w-auto object-cover object-top"
          />
        </div>
      </div>
      {uploading && (
        <p className="text-primary-500 small-regular md:base-semibold">
          Uploading...
        </p>
      )}
      {!uploading && currentFile.length === 0 && (
        <div className="py-3">
          <Button
            type="button"
            onClick={e => {
              e.stopPropagation();
              document.getElementById('fileInput')?.click();
            }} // Handle the actual upload on button click
            className="shad-button_dark_4"
          >
            Select File
          </Button>
        </div>
      )}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-4 bg-opacity-75">
          <div className="story-viewer-inner">
            <img
              src={fileUrl}
              alt="story-preview"
              className="story-preview-image"
            />
            <div
              className="cancel-icon"
              onClick={() => {
                setCurrentFile([]);
                setShowPreview(false);
              }}
            >
              <div className="cancel-story-container">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
              </div>
            </div>
            <div
              className="flex flex-col items-center justify-center mt-4 space-x-4"
              onClick={() => handleStoryUpload(currentFile[0])}
            >
              {uploading ? 'Uploading...' : 'Upload'}
              <img
                src="/assets/icons/arrow.svg"
                alt="filter"
                width={26}
                height={26}
                onClick={() => setShowPreview(false)}
                className="arrow-icon-story w-6 h-6"
              />
            </div>
          </div>
        </div>
      )}
      {message && <p className={`error-message ${messageColor}`}>{message}</p>}
    </div>
  );
};

export default StoryUploader;
