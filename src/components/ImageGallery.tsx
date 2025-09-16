'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Loader2, Lock } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import PasswordPrompt from './PasswordPrompt';
import DeleteConfirmation from './DeleteConfirmation';

interface ImageData {
  id: string;
  url: string;
  name: string;
  created_at?: string;
}

interface SupabaseFile {
  id: string;
  name: string;
  created_at: string;
}

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
  const [hasUploadAccess, setHasUploadAccess] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    imageId: string;
    imageName: string;
  }>({ isOpen: false, imageId: '', imageName: '' });

  // Load images from Supabase on component mount
  useEffect(() => {
    loadImages();
    
    // Check if user has upload access from session storage
    const hasAccess = sessionStorage.getItem('king-upload-access') === 'true';
    setHasUploadAccess(hasAccess);
  }, []);

  const loadImages = async () => {
    try {
      setConnectionError(null);
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.storage
        .from('king-photos')
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error loading images:', error);
        if (error.message?.includes('missing environment variables')) {
          setConnectionError('Supabase not configured. Please set up environment variables on Vercel.');
        } else {
          setConnectionError('Unable to load images. Please check your Supabase connection.');
        }
        return;
      }

      const imageUrls = await Promise.all(
        data.map(async (file: SupabaseFile) => {
          const { data: urlData } = supabase.storage
            .from('king-photos')
            .getPublicUrl(file.name);
          
          return {
            id: file.id,
            url: urlData.publicUrl,
            name: file.name,
            created_at: file.created_at,
          };
        })
      );

      setImages(imageUrls);
    } catch (error) {
      console.error('Error loading images:', error);
      setConnectionError('Connection error. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Check if user has upload access
    if (!hasUploadAccess) {
      event.target.value = ''; // Clear the file input
      setIsPasswordPromptOpen(true);
      return;
    }

    setIsUploading(true);
    
        try {
          const supabase = getSupabaseClient();
          for (const file of Array.from(files)) {
            if (file.type.startsWith('image/')) {
              // Generate unique filename
              const fileExt = file.name.split('.').pop();
              const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
              
              const { data, error } = await supabase.storage
                .from('king-photos')
                .upload(fileName, file);

              if (error) {
                console.error('Error uploading file:', error);
                if (error.message?.includes('missing environment variables')) {
                  alert('Supabase not configured. Please set up environment variables on Vercel.');
                  return;
                }
                continue;
              }

              // Get public URL
              const { data: urlData } = supabase.storage
                .from('king-photos')
                .getPublicUrl(fileName);

              const newImage: ImageData = {
                id: data.id,
                url: urlData.publicUrl,
                name: file.name,
                created_at: new Date().toISOString(),
              };

              setImages(prev => [newImage, ...prev]); // Add to beginning of array
            }
          }
        } catch (error) {
          console.error('Error uploading images:', error);
        } finally {
          setIsUploading(false);
          event.target.value = ''; // Reset input
        }
  };

  const handleDeleteClick = (id: string, fileName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      imageId: id,
      imageName: fileName,
    });
  };

  const confirmDelete = async () => {
    const { imageId, imageName } = deleteConfirmation;
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.storage
        .from('king-photos')
        .remove([imageName]);

      if (error) {
        console.error('Error deleting file:', error);
        return;
      }

      setImages(prev => prev.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setDeleteConfirmation({ isOpen: false, imageId: '', imageName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, imageId: '', imageName: '' });
  };

  const handleUploadClick = () => {
    if (hasUploadAccess) {
      // Trigger file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      fileInput?.click();
    } else {
      setIsPasswordPromptOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setHasUploadAccess(true);
    sessionStorage.setItem('king-upload-access', 'true');
    setIsPasswordPromptOpen(false);
    // Automatically trigger file input after successful password
    setTimeout(() => {
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) {
        // Ensure the input is enabled before clicking
        fileInput.disabled = false;
        fileInput.click();
      }
    }, 200); // Increased timeout to ensure state update
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center drop-shadow-lg">
          King&apos;s Gallery 🐕✨
        </h2>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center drop-shadow-lg">
        King&apos;s Gallery 🐕✨
      </h2>
      
      {/* Upload Section */}
      <div className="mb-8">
        <label 
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            hasUploadAccess 
              ? 'border-white/30 bg-white/5 hover:bg-white/10' 
              : 'border-yellow-400/50 bg-yellow-400/5 hover:bg-yellow-400/10'
          }`}
          onClick={handleUploadClick}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-4 text-white/70 animate-spin" />
            ) : hasUploadAccess ? (
              <Upload className="w-8 h-8 mb-4 text-white/70" />
            ) : (
              <Lock className="w-8 h-8 mb-4 text-yellow-400" />
            )}
            <p className="mb-2 text-sm text-white/70">
              <span className="font-semibold">
                {isUploading ? 'Uploading...' : hasUploadAccess ? 'Click to upload' : 'Click to unlock upload'}
              </span> King&apos;s photos
            </p>
            <p className="text-xs text-white/50">
              {hasUploadAccess ? 'PNG, JPG or GIF (MAX. 10MB each)' : 'Password required to upload'}
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading || !hasUploadAccess}
          />
        </label>
      </div>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick(image.id, image.name);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {connectionError && (
        <div className="text-center py-12">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-200 text-lg mb-2">⚠️ Connection Issue</p>
            <p className="text-red-100 text-sm mb-4">{connectionError}</p>
            <button
              onClick={loadImages}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !isLoading && !connectionError && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐕</div>
          <p className="text-white/50 text-lg">No photos of King yet!</p>
          <p className="text-white/30 text-sm">Upload some adorable photos to get started</p>
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{ 
                width: 'auto', 
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm">
              {selectedImage.name}
            </div>
          </div>
        </div>
      )}

      {/* Password Prompt */}
      <PasswordPrompt
        isOpen={isPasswordPromptOpen}
        onClose={() => setIsPasswordPromptOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        imageName={deleteConfirmation.imageName}
      />
    </div>
  );
}
