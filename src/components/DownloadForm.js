import React, { useState } from 'react';
import { Download, Folder } from 'lucide-react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';

const DownloadSection = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    margin: 2rem auto;
    padding: 1.5rem;
  }
`;

const UrlInputGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const UrlInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const SaveLocation = styled.div`
  color: #333;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 14px;
  }
`;

const LocationInputGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LocationInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  background: #f8f9fa;
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ProgressContainer = styled.div`
  margin-top: 2rem;
  display: ${props => props.show ? 'block' : 'none'};
`;

function DownloadForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const {
    trialDaysRemaining,
    isSubscribed,
    downloadsToday,
    saveLocation,
    isDownloading,
    downloadProgress,
    incrementDownloads,
    showTrialExpiredModal,
    showSubscriptionModal,
    setDownloadProgress,
    setSaveLocation
  } = useUser();

  const isValidVideoUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const validDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv'];
      return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const handleDownload = async () => {
    if (!videoUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    if (!saveLocation.trim()) {
      toast.error('Please select a save location');
      return;
    }

    // Check trial/subscription status
    if (!isSubscribed && trialDaysRemaining <= 0) {
      showTrialExpiredModal();
      return;
    }

    // Check daily download limits for trial users
    if (!isSubscribed && downloadsToday >= 10) {
      toast.error('Daily download limit reached (10 downloads). Upgrade to Premium for unlimited downloads.');
      setTimeout(() => {
        document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
      }, 1000);
      return;
    }

    // Validate URL format
    if (!isValidVideoUrl(videoUrl)) {
      toast.error('Please enter a valid video URL from supported platforms');
      return;
    }

    await startDownload();
  };

  const startDownload = async () => {
    setDownloadProgress(true, 0);
    
    // Simulate download progress
    const duration = 3000 + Math.random() * 2000; // 3-5 seconds
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 100);
      setDownloadProgress(true, progress);

      if (progress >= 100) {
        clearInterval(progressInterval);
        completeDownload();
      }
    }, interval);
  };

  const completeDownload = () => {
    // Update download count
    if (!isSubscribed) {
      incrementDownloads();
    }

    // Reset form
    setVideoUrl('');
    
    // Show success message
    toast.success('Video downloaded successfully!');
    
    // Hide progress after delay
    setTimeout(() => {
      setDownloadProgress(false, 0);
    }, 2000);
  };

  const browseSaveLocation = () => {
    // Simulate folder selection
    const folders = [
      '/Users/Downloads',
      '/Users/Documents/Videos',
      '/Users/Desktop',
      '/Users/Movies'
    ];
    
    const selectedFolder = folders[Math.floor(Math.random() * folders.length)];
    setSaveLocation(selectedFolder);
    toast.success('Save location updated');
  };

  return (
    <DownloadSection>
      <UrlInputGroup>
        <UrlInput
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste video URL here..."
          disabled={isDownloading}
        />
        <button 
          className="btn btn-primary btn-large"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Download size={20} />
              </motion.div>
              Downloading...
            </>
          ) : (
            <>
              <Download size={20} />
              Download
            </>
          )}
        </button>
      </UrlInputGroup>
      
      <SaveLocation>
        <label htmlFor="saveLocation">Save to:</label>
        <LocationInputGroup>
          <LocationInput
            type="text"
            value={saveLocation}
            placeholder="Choose download folder..."
            readOnly
            onClick={browseSaveLocation}
          />
          <button 
            className="btn btn-secondary"
            onClick={browseSaveLocation}
            disabled={isDownloading}
          >
            <Folder size={20} />
            Browse
          </button>
        </LocationInputGroup>
      </SaveLocation>

      <ProgressContainer show={isDownloading}>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${downloadProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="progress-text">
          Downloading... {Math.round(downloadProgress)}%
        </div>
      </ProgressContainer>
    </DownloadSection>
  );
}

export default DownloadForm;