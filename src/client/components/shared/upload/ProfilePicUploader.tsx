import {
  useGetProfilePicPreview,
  useUploadProfilePic,
} from '@/lib/react-query/upload/UploadQuerys';
import { useCallback, useEffect, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

type FileWithPreview = File & {
  preview: string;
};

const ProfilePicUploader = ({
  fieldChange,
  mediaUrl,
}: ProfileUploaderProps) => {
  const [currentFile, setCurrentFile] = useState<FileWithPreview[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [message, setMessage] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [messageColor, setMessageColor] = useState('');

  const profilePicMutation = useUploadProfilePic();
  const imagePreview = useGetProfilePicPreview();

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      }) as FileWithPreview;
      setCurrentFile([fileWithPreview]);
      setFileUrl(fileWithPreview.preview);
      fieldChange([file]);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles.length > 0) {
        const filesWithPreview: FileWithPreview[] = acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setCurrentFile(filesWithPreview);
        setFileUrl(filesWithPreview[0].preview);
        fieldChange(acceptedFiles);

        try {
          const formData = new FormData();
          const file = acceptedFiles[0];
          formData.append('file', file);
          const response = await profilePicMutation.mutateAsync({ formData });
          if (response?.data?.url) {
            setFileUrl(response.data);
            fieldChange([
              {
                ...acceptedFiles[0],
                preview: response?.data,
              } as FileWithPreview,
            ]);
            console.log('response:', response?.data);
            setMessage('Image uploaded successfully!');
            setMessageColor('green-500');
            setImageUploaded(true);
          } else {
            setMessage('Error uploading profile pic. Please try again.');
            setMessageColor('text-red-500');
          }

          const uploadedImage = response?.data;
          console.log('Uploaded Image:', uploadedImage);
          messageColor === 'green-500' && 'red-500';
          setMessage('Image uploaded successfully!');
          setMessageColor('green-500');
        } catch (error) {
          console.error('Error uploading profile pic:', error);
          setMessage('Error uploading profile pic. Please try again.');
          setMessageColor('text-red-500');
        }
      }
    },
    [fieldChange, profilePicMutation]
  );

  useEffect(() => {
    if (imageUploaded) {
      const fetchPreviewImage = async () => {
        try {
          const previewImageUrl = await imagePreview.mutateAsync();
          setFileUrl(previewImageUrl);
        } catch (error) {
          console.error('Error fetching preview image:', error);
          setMessage('Error fetching preview image. Please try again.');
          setMessageColor('text-red-500');
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
      'image/*': ['.png', '.jpeg', '.jpg'],
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
        name="file"
        className="cursor-pointer"
        onChange={selectFile}
      />

      <div className="cursor-pointer flex-center gap-4">
        <img
          src={fileUrl || '/assets/icons/profile-placeholder.svg'}
          alt="profile-preview"
          className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:base-semibold justify-center">
          Change profile photo
        </p>
      </div>

      {message && <p className={`error-message ${messageColor}`}>{message}</p>}
    </div>
  );
};

export default ProfilePicUploader;
