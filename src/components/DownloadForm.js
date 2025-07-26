import React, { useState } from 'react';
import { Download, ExternalLink, FileVideo, Info, CheckCircle } from 'lucide-react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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

const ProgressContainer = styled.div`
  margin-top: 2rem;
  display: ${props => props.show ? 'block' : 'none'};
`;

const VideoInfoCard = styled(motion.div)`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border: 2px solid #e9ecef;
`;

const VideoThumbnail = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  .placeholder {
    color: white;
    font-size: 3rem;
  }
`;

const VideoDetails = styled.div`
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  .meta {
    display: flex;
    gap: 1rem;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
`;

const QualityOptions = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const QualityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const QualityOption = styled(motion.div)`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }

  .quality-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .quality-name {
    font-weight: 600;
    color: #333;
  }

  .quality-badge {
    background: #667eea;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .quality-details {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .download-btn {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const DownloadedFiles = styled(motion.div)`
  background: #e8f5e8;
  border: 2px solid #28a745;
  border-radius: 15px;
  padding: 1.5rem;
  margin-top: 1.5rem;

  h4 {
    color: #28a745;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FileItem = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: between;
  align-items: center;
  gap: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  .file-info {
    flex: 1;
    
    .file-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    
    .file-details {
      color: #666;
      font-size: 0.9rem;
    }
  }

  .file-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #28a745;
    background: white;
    color: #28a745;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    &:hover {
      background: #28a745;
      color: white;
    }

    &.primary {
      background: #28a745;
      color: white;

      &:hover {
        background: #218838;
      }
    }
  }
`;

function DownloadForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  
  const {
    trialDaysRemaining,
    isSubscribed,
    downloadsToday,
    saveLocation,
    isDownloading,
    downloadProgress,
    incrementDownloads,
    showTrialExpiredModal,
    // showSubscriptionModal,
    setDownloadProgress,
  } = useUser();

  const isValidVideoUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const validDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv', 'facebook.com'];
      return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const analyzeVideo = async () => {
    if (!videoUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    if (!isValidVideoUrl(videoUrl)) {
      toast.error('Please enter a valid video URL from supported platforms');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate API call to analyze video
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock video information
      const mockVideoInfo = {
        title: "Amazing Nature Documentary - Wildlife in 4K",
        duration: "15:42",
        views: "2.3M views",
        uploader: "Nature Channel",
        thumbnail: null, // We'll use a placeholder
        description: "Experience the beauty of nature in stunning 4K resolution. This documentary showcases incredible wildlife footage from around the world.",
        qualities: [
          {
            id: '4k',
            name: '4K Ultra HD',
            resolution: '3840x2160',
            size: '2.1 GB',
            format: 'MP4',
            fps: '60fps'
          },
          {
            id: '1080p',
            name: 'Full HD',
            resolution: '1920x1080',
            size: '850 MB',
            format: 'MP4',
            fps: '60fps'
          },
          {
            id: '720p',
            name: 'HD',
            resolution: '1280x720',
            size: '420 MB',
            format: 'MP4',
            fps: '30fps'
          },
          {
            id: '480p',
            name: 'Standard',
            resolution: '854x480',
            size: '180 MB',
            format: 'MP4',
            fps: '30fps'
          }
        ]
      };
      
      setVideoInfo(mockVideoInfo);
      toast.success('Video analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze video. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadQuality = async (quality) => {
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

    if (!saveLocation.trim()) {
      toast.error('Please select a save location');
      return;
    }

    await startDownload(quality);
  };

  const startDownload = async (quality) => {
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
        completeDownload(quality);
      }
    }, interval);
  };

  const completeDownload = (quality) => {
    // Update download count
    if (!isSubscribed) {
      incrementDownloads();
    }

    // Create download file info
    const fileName = `${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_${quality.name.replace(/\s+/g, '_')}.${quality.format.toLowerCase()}`;
    const downloadedFile = {
      id: Date.now(),
      name: fileName,
      quality: quality.name,
      size: quality.size,
      format: quality.format,
      downloadUrl: `blob:${window.location.origin}/${Date.now()}`, // Mock blob URL
      downloadTime: new Date().toLocaleString()
    };

    setDownloadedFiles(prev => [downloadedFile, ...prev]);
    
    // Show success message
    toast.success(`${quality.name} quality downloaded successfully!`);
    
    // Hide progress after delay
    setTimeout(() => {
      setDownloadProgress(false, 0);
    }, 2000);
  };

  const downloadFile = (file) => {
    // Create a mock download
    const link = document.createElement('a');
    link.href = file.downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started!');
  };

  const copyDownloadLink = (file) => {
    navigator.clipboard.writeText(file.downloadUrl);
    toast.success('Download link copied to clipboard!');
  };

  const resetForm = () => {
    setVideoUrl('');
    setVideoInfo(null);
    setDownloadedFiles([]);
  };

  return (
    <DownloadSection>
      <UrlInputGroup>
        <UrlInput
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste video URL here (YouTube, Vimeo, etc.)..."
          disabled={isAnalyzing || isDownloading}
        />
        <button 
          className="btn btn-primary btn-large"
          onClick={analyzeVideo}
          disabled={isAnalyzing || isDownloading}
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Info size={20} />
              </motion.div>
              Analyzing...
            </>
          ) : (
            <>
              <Info size={20} />
              Analyze
            </>
          )}
        </button>
      </UrlInputGroup>

      <AnimatePresence>
        {videoInfo && (
          <VideoInfoCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VideoThumbnail>
              {videoInfo.thumbnail ? (
                <img src={videoInfo.thumbnail} alt="Video thumbnail" />
              ) : (
                <FileVideo className="placeholder" size={60} />
              )}
            </VideoThumbnail>
            
            <VideoDetails>
              <h3>{videoInfo.title}</h3>
              <div className="meta">
                <span>Duration: {videoInfo.duration}</span>
                <span>{videoInfo.views}</span>
                <span>By: {videoInfo.uploader}</span>
              </div>
              <div className="description">{videoInfo.description}</div>
            </VideoDetails>

            <QualityOptions>
              <h4>
                <Download size={18} />
                Choose Quality & Download
              </h4>
              <QualityGrid>
                {videoInfo.qualities.map((quality) => (
                  <QualityOption
                    key={quality.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="quality-header">
                      <span className="quality-name">{quality.name}</span>
                      <span className="quality-badge">{quality.format}</span>
                    </div>
                    <div className="quality-details">
                      {quality.resolution} • {quality.size} • {quality.fps}
                    </div>
                    <button
                      className="download-btn"
                      onClick={() => downloadQuality(quality)}
                      disabled={isDownloading}
                    >
                      <Download size={16} />
                      Download {quality.name}
                    </button>
                  </QualityOption>
                ))}
              </QualityGrid>
            </QualityOptions>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button 
                className="btn btn-outline"
                onClick={resetForm}
                disabled={isDownloading}
              >
                Analyze Another Video
              </button>
            </div>
          </VideoInfoCard>
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {downloadedFiles.length > 0 && (
          <DownloadedFiles
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h4>
              <CheckCircle size={18} />
              Downloaded Files ({downloadedFiles.length})
            </h4>
            {downloadedFiles.map((file) => (
              <FileItem key={file.id}>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-details">
                    {file.quality} • {file.size} • {file.format} • Downloaded: {file.downloadTime}
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    className="action-btn primary"
                    onClick={() => downloadFile(file)}
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => copyDownloadLink(file)}
                  >
                    <ExternalLink size={14} />
                    Copy Link
                  </button>
                </div>
              </FileItem>
            ))}
          </DownloadedFiles>
        )}
      </AnimatePresence>
    </DownloadSection>
  );
}

export default DownloadForm;
