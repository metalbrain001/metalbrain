import {
  useGetPreviewImage,
  useUploadImage,
} from '@/lib/react-query/upload/UploadQuerys';
import { useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

type FileWithPreview = File & {
  preview: string;
};

const PostImageUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [currentFile, setCurrentFile] = useState<FileWithPreview[]>([]);
  const [previewImage, setPreviewImage] = useState(mediaUrl);
  const [message, setMessage] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [messageColor, setMessageColor] = useState('');

  const uploadImageMutation = useUploadImage();

  const imagePreview = useGetPreviewImage();

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      }) as FileWithPreview;
      setCurrentFile([fileWithPreview]);
      setPreviewImage(fileWithPreview.preview);
      fieldChange([file]);
      handleUpload(file);
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
        setPreviewImage(filesWithPreview[0].preview);
        fieldChange(acceptedFiles);
        handleUpload(acceptedFiles[0]);
      }
    },
    [fieldChange]
  );

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await uploadImageMutation.mutateAsync({ formData });
      const uploadedImage = response.data;
      console.log('response:', uploadedImage);
      messageColor === 'green-500' && 'red-500';
      setMessage('Image uploaded successfully!');
      setMessageColor('green-500');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image. Please try again.');
      setMessageColor('red-500');
    }
  };

  // Fetch the preview image URL for the logged-in user
  useEffect(() => {
    if (imageUploaded) {
      const fetchPreviewImage = async () => {
        try {
          const previewImageUrl = await imagePreview.mutateAsync();
          setPreviewImage(previewImageUrl);
        } catch (error) {
          console.error('Error fetching preview image:', error);
          setMessage('Error fetching preview image. Please try again.');
        }
      };

      fetchPreviewImage();
      setImageUploaded(false); // Reset the flag after fetching the image
    }
  }, [imageUploaded, imagePreview]);

  useEffect(() => {
    return () => {
      currentFile.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [currentFile]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input
        {...getInputProps()}
        id="fileInput"
        type="file"
        formMethod="POST"
        name="image"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            selectFile(e);
          }
        }}
        className="cursor-pointer"
      />

      {previewImage ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img
              src={previewImage}
              alt="image-preview"
              loading="lazy"
              className="file_uploader-img"
            />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file-upload"
            loading="lazy"
            width={96}
            height={77}
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>
          <Button
            type="button"
            onClick={e => {
              e.stopPropagation();
              document.getElementById('fileInput')?.click();
              handleUpload;
            }}
            className="shad-button_dark_4"
          >
            Browse Files
          </Button>
        </div>
      )}
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default PostImageUploader;
