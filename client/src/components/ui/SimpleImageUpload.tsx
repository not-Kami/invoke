

interface SimpleImageUploadProps {
  onImageChange: (imageData: string | null) => void;
}

const SimpleImageUpload: React.FC<SimpleImageUploadProps> = ({ onImageChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Photo de profil (optionnel)
      </label>
      
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-400"
        />
        <p className="text-xs text-gray-500 mt-2">
          Sélectionnez une image PNG ou JPG
        </p>
      </div>
    </div>
  );
};

export default SimpleImageUpload;
