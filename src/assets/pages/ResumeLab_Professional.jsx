import { useState, useEffect, useRef } from 'react';
import '../../../App.css';
import { apiFetch } from '../../api';

const ResumeLab = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const fileInputRef = useRef(null);

  const fetchTemplates = async () => {
    try {
      const data = await apiFetch('/resume/templates');
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    const loadTemplates = async () => {
      await fetchTemplates();
    };

    void loadTemplates();
  }, []);


  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setLoading(true);
    
    try {
      await file.text();
      // Simulate ATS analysis
      const score = Math.floor(Math.random() * 40) + 60;
      setAtsScore({
        score,
        keywords: ['React', 'JavaScript', 'Node.js', 'AWS'],
        missing: ['TypeScript', 'Docker', 'Kubernetes'],
        feedback: 'Good technical foundation. Consider adding cloud certifications.'
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template && template.preview) {
      // Open template in new window
      window.open(template.preview, '_blank');
    }
  };

  const previewTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    setActiveTab('preview');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">📄 Resume Lab</h2>
        <p className="page-subtitle">Professional templates with ATS optimization</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
        <button
          onClick={() => setActiveTab('gallery')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: activeTab === 'gallery' ? '#3b82f6' : 'transparent',
            color: activeTab === 'gallery' ? 'white' : '#666',
            cursor: 'pointer',
            fontWeight: 600,
            borderRadius: '4px 4px 0 0'
          }}
        >
          Template Gallery
        </button>
        <button
          onClick={() => setActiveTab('analyze')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: activeTab === 'analyze' ? '#3b82f6' : 'transparent',
            color: activeTab === 'analyze' ? 'white' : '#666',
            cursor: 'pointer',
            fontWeight: 600,
            borderRadius: '4px 4px 0 0'
          }}
        >
          Upload & Analyze
        </button>
        {selectedTemplate && (
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: activeTab === 'preview' ? '#3b82f6' : 'transparent',
              color: activeTab === 'preview' ? 'white' : '#666',
              cursor: 'pointer',
              fontWeight: 600,
              borderRadius: '4px 4px 0 0'
            }}
          >
            Preview
          </button>
        )}
      </div>

      {/* Template Gallery Tab */}
      {activeTab === 'gallery' && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 600 }}>
            Professional Resume Templates
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {templates.map((template) => (
              <div key={template.id} style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                ':hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }
              }}>
                {/* Template Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '20px',
                  color: 'white',
                  textAlign: 'center',
                  minHeight: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {template.name}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>
                    {template.category}
                  </div>
                </div>

                {/* Template Info */}
                <div style={{ padding: '15px' }}>
                  <p style={{ fontSize: '13px', color: '#555', marginBottom: '10px', lineHeight: '1.5' }}>
                    {template.description}
                  </p>

                  {/* Best For */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>
                      Best For:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {template.bestFor.slice(0, 3).map((role, idx) => (
                        <span key={idx} style={{
                          fontSize: '10px',
                          background: '#e8f4f8',
                          color: '#2d6ca3',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 500
                        }}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rating & Downloads */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    <span>⭐ {template.rating}/5.0</span>
                    <span>📥 {template.downloads} downloads</span>
                  </div>

                  {/* ATS Score */}
                  <div style={{
                    background: '#f0f9ff',
                    padding: '8px',
                    borderRadius: '4px',
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '3px' }}>
                      ATS Score
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                      {template.atsScore}%
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => previewTemplate(template.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#2563eb'}
                      onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => downloadTemplate(template.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#059669'}
                      onMouseOut={(e) => e.target.style.background = '#10b981'}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload & Analyze Tab */}
      {activeTab === 'analyze' && (
        <div style={{ marginTop: '20px' }}>
          <div style={{
            background: '#f8fafb',
            border: '2px dashed #3b82f6',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (loading) return;
            const files = e.dataTransfer.files;
            if (files.length > 0) handleFileUpload(files[0]);
          }}
          onClick={() => !loading && fileInputRef.current?.click()}
          style={{
            background: '#f8fafb',
            border: '2px dashed #3b82f6',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            cursor: loading ? 'wait' : 'pointer',
            transition: 'all 0.3s',
            opacity: loading ? 0.8 : 1
          }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📤</div>
            <h3 style={{ marginBottom: '10px' }}>Upload Your Resume</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Drop a PDF, DOCX, or TXT file here, or click to browse
            </p>
            <p style={{ color: '#999', fontSize: '12px', marginTop: '10px' }}>
              Max file size: 8 MB
            </p>
          </div>

          {uploadedFile && (
            <div style={{ marginTop: '20px', background: '#f0fdf4', border: '1px solid #10b981', borderRadius: '8px', padding: '15px' }}>
              <div style={{ color: '#166534', fontWeight: 600, marginBottom: '10px' }}>
                ✓ File uploaded: {uploadedFile.name}
              </div>
            </div>
          )}

          {loading && (
            <div style={{ marginTop: '20px', color: '#2563eb', fontWeight: 600 }}>
              Analyzing resume… please wait.
            </div>
          )}

          {atsScore && (
            <div style={{ marginTop: '20px', background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 600 }}>
                ATS Analysis Results
              </h3>
              
              {/* Score Box */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>
                  Your ATS Score
                </div>
                <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                  {atsScore.score}%
                </div>
              </div>

              {/* Keywords */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 600 }}>
                  ✓ Found Keywords ({atsScore.keywords.length})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {atsScore.keywords.map((keyword, idx) => (
                    <span key={idx} style={{
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 600 }}>
                  ⚠ Missing Keywords ({atsScore.missing.length})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {atsScore.missing.map((keyword, idx) => (
                    <span key={idx} style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div style={{
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '13px',
                color: '#78350f'
              }}>
                <strong>💡 Feedback:</strong> {atsScore.feedback}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && selectedTemplate && (
        <div style={{ marginTop: '20px' }}>
          <iframe
            src={`/templates/template-${selectedTemplate}-executive.html`}
            style={{
              width: '100%',
              height: '800px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }}
            title="Template Preview"
          />
        </div>
      )}
    </div>
  );
};

export default ResumeLab;
