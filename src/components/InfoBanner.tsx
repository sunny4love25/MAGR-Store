import { useState, useEffect } from 'react';
import { Edit2, Check, X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useInfoBanner } from '../contexts/InfoBannerContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30); // Speed of typing

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}

export function InfoBanner() {
  const { bannerMessages, updateBannerMessage, addBannerMessage, deleteBannerMessage } = useInfoBanner();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editMessages, setEditMessages] = useState(bannerMessages);

  const isAdmin = user?.role === 'admin';

  // Rotate through messages
  useEffect(() => {
    if (bannerMessages.length === 0 || isEditing) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerMessages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, [bannerMessages.length, isEditing]);

  const handleSave = () => {
    editMessages.forEach((message, index) => {
      if (index < bannerMessages.length) {
        updateBannerMessage(index, message);
      } else {
        addBannerMessage(message);
      }
    });
    
    // Delete messages that were removed
    if (editMessages.length < bannerMessages.length) {
      for (let i = bannerMessages.length - 1; i >= editMessages.length; i--) {
        deleteBannerMessage(i);
      }
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditMessages(bannerMessages);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditMessages([...bannerMessages]);
    setIsEditing(true);
  };

  const handleAddMessage = () => {
    setEditMessages([...editMessages, { title: '', description: '' }]);
  };

  const handleDeleteMessage = (index: number) => {
    setEditMessages(editMessages.filter((_, i) => i !== index));
  };

  const handleUpdateMessage = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...editMessages];
    updated[index][field] = value;
    setEditMessages(updated);
  };

  if (bannerMessages.length === 0) return null;

  return (
    <>
      <div className="flex items-start gap-2 text-xs flex-1 mr-4">
        <span className="text-orange-600 whitespace-nowrap pt-0.5">
          Special Info:
        </span>
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-gray-600 block leading-tight"
            >
              <TypewriterText text={bannerMessages[currentIndex].description} />
            </motion.span>
          </AnimatePresence>
        </div>
        {isAdmin && (
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-orange-600 transition-colors flex-shrink-0"
            title="Edit banners (Admin only)"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Info Banner Messages</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {editMessages.map((message, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded">
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={message.title}
                    onChange={(e) => handleUpdateMessage(index, 'title', e.target.value)}
                    placeholder="Title"
                    className="bg-white flex-1"
                  />
                  <Input
                    value={message.description}
                    onChange={(e) => handleUpdateMessage(index, 'description', e.target.value)}
                    placeholder="Description"
                    className="bg-white flex-[2]"
                  />
                </div>
                <Button
                  onClick={() => handleDeleteMessage(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAddMessage}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Message
              </Button>
              <div className="flex-1"></div>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                <Check className="w-4 h-4 mr-1" />
                Save All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
