import React, { useState, useRef, useCallback, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Trash2, 
  Move, 
  Eye, 
  Code, 
  Smartphone, 
  Monitor, 
  Tablet,
  Type,
  Image as ImageIcon,
  Square,
  Link,
  Mail
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailComponent {
  id: string
  type: 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'heading'
  content: any
  styles: Record<string, any>
}

interface EmailBuilderProps {
  onContentChange: (html: string, components: EmailComponent[]) => void
  initialComponents?: EmailComponent[]
}

const ComponentPalette = () => {
  const componentTypes = [
    { type: 'heading', icon: Type, label: 'Heading', color: 'bg-blue-100 text-blue-700' },
    { type: 'text', icon: Type, label: 'Text Block', color: 'bg-green-100 text-green-700' },
    { type: 'image', icon: ImageIcon, label: 'Image', color: 'bg-purple-100 text-purple-700' },
    { type: 'button', icon: Square, label: 'Button', color: 'bg-orange-100 text-orange-700' },
    { type: 'divider', icon: Move, label: 'Divider', color: 'bg-gray-100 text-gray-700' },
    { type: 'spacer', icon: Square, label: 'Spacer', color: 'bg-yellow-100 text-yellow-700' }
  ]

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-muted-foreground">COMPONENTS</h3>
      <div className="grid grid-cols-1 gap-2">
        {componentTypes.map((comp) => (
          <DraggableComponent key={comp.type} componentType={comp.type}>
            <div className={cn(
              "flex items-center space-x-3 p-3 rounded-lg cursor-grab hover:shadow-md transition-all border-2 border-dashed border-transparent hover:border-primary/30",
              comp.color
            )}>
              <comp.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{comp.label}</span>
            </div>
          </DraggableComponent>
        ))}
      </div>
    </div>
  )
}

const DraggableComponent: React.FC<{ componentType: string; children: React.ReactNode }> = ({ 
  componentType, 
  children 
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type: componentType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  )
}

const ComponentRenderer: React.FC<{
  component: EmailComponent
  isSelected: boolean
  onSelect: () => void
  onUpdate: (component: EmailComponent) => void
  onDelete: () => void
}> = ({ component, isSelected, onSelect, onUpdate, onDelete }) => {
  const handleContentChange = (newContent: any) => {
    onUpdate({ ...component, content: newContent })
  }

  const renderComponent = () => {
    switch (component.type) {
      case 'heading':
        return (
          <div 
            style={component.styles}
            className="font-bold text-2xl"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange({ text: e.target.textContent })}
          >
            {component.content?.text || 'Your Heading Here'}
          </div>
        )
      
      case 'text':
        return (
          <div 
            style={component.styles}
            className="text-base leading-relaxed"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentChange({ text: e.target.textContent })}
          >
            {component.content?.text || 'Edit this text block...'}
          </div>
        )
      
      case 'image':
        return (
          <div style={component.styles} className="text-center">
            {component.content?.src ? (
              <img 
                src={component.content.src} 
                alt={component.content.alt || ''} 
                className="max-w-full h-auto rounded-lg"
                style={{ width: component.content.width || 'auto' }}
              />
            ) : (
              <div className="bg-muted rounded-lg p-8 border-2 border-dashed border-muted-foreground/30">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Click to add image</p>
              </div>
            )}
          </div>
        )
      
      case 'button':
        return (
          <div style={component.styles} className="text-center">
            <button 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              style={component.content?.buttonStyles}
            >
              {component.content?.text || 'Click Here'}
            </button>
          </div>
        )
      
      case 'divider':
        return (
          <div style={component.styles} className="py-4">
            <hr className="border-border" />
          </div>
        )
      
      case 'spacer':
        return (
          <div 
            style={{ 
              height: component.content?.height || '20px',
              ...component.styles 
            }}
          />
        )
      
      default:
        return <div>Unknown component</div>
    }
  }

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onSelect}
    >
      {renderComponent()}
      
      {/* Component overlay with controls */}
      <div className={cn(
        "absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity",
        isSelected && "opacity-100"
      )}>
        <div className="flex space-x-1 bg-background shadow-md rounded-lg p-1 border">
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const EmailCanvas: React.FC<{
  components: EmailComponent[]
  selectedId: string | null
  onSelectComponent: (id: string | null) => void
  onUpdateComponent: (id: string, component: EmailComponent) => void
  onDeleteComponent: (id: string) => void
  onAddComponent: (type: string, index?: number) => void
}> = ({ 
  components, 
  selectedId, 
  onSelectComponent, 
  onUpdateComponent, 
  onDeleteComponent, 
  onAddComponent 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: { type: string }) => {
      onAddComponent(item.type)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={cn(
        "min-h-[600px] bg-background border rounded-lg p-6 transition-colors",
        isOver && "border-primary bg-primary/5"
      )}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {components.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Start Building Your Email</h3>
            <p className="text-sm">Drag components from the left panel to begin</p>
          </div>
        ) : (
          components.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              isSelected={selectedId === component.id}
              onSelect={() => onSelectComponent(component.id)}
              onUpdate={(updated) => onUpdateComponent(component.id, updated)}
              onDelete={() => onDeleteComponent(component.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

const PropertyPanel: React.FC<{
  selectedComponent: EmailComponent | null
  onUpdateComponent: (component: EmailComponent) => void
}> = ({ selectedComponent, onUpdateComponent }) => {
  if (!selectedComponent) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-muted rounded-lg mx-auto flex items-center justify-center">
            <Type className="w-6 h-6" />
          </div>
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    )
  }

  const updateStyles = (newStyles: Record<string, any>) => {
    onUpdateComponent({
      ...selectedComponent,
      styles: { ...selectedComponent.styles, ...newStyles }
    })
  }

  const updateContent = (newContent: any) => {
    onUpdateComponent({
      ...selectedComponent,
      content: { ...selectedComponent.content, ...newContent }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">
          {selectedComponent.type.toUpperCase()} PROPERTIES
        </h3>
        
        {/* Common properties */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="margin">Margin</Label>
            <Input
              id="margin"
              value={selectedComponent.styles?.margin || ''}
              onChange={(e) => updateStyles({ margin: e.target.value })}
              placeholder="e.g., 10px 0"
            />
          </div>
          
          <div>
            <Label htmlFor="padding">Padding</Label>
            <Input
              id="padding"
              value={selectedComponent.styles?.padding || ''}
              onChange={(e) => updateStyles({ padding: e.target.value })}
              placeholder="e.g., 20px"
            />
          </div>
        </div>

        {/* Component-specific properties */}
        {selectedComponent.type === 'text' && (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <Input
                id="fontSize"
                value={selectedComponent.styles?.fontSize || ''}
                onChange={(e) => updateStyles({ fontSize: e.target.value })}
                placeholder="e.g., 16px"
              />
            </div>
            <div>
              <Label htmlFor="color">Text Color</Label>
              <Input
                id="color"
                type="color"
                value={selectedComponent.styles?.color || '#000000'}
                onChange={(e) => updateStyles({ color: e.target.value })}
              />
            </div>
          </div>
        )}

        {selectedComponent.type === 'image' && (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="imageSrc">Image URL</Label>
              <Input
                id="imageSrc"
                value={selectedComponent.content?.src || ''}
                onChange={(e) => updateContent({ src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="imageAlt">Alt Text</Label>
              <Input
                id="imageAlt"
                value={selectedComponent.content?.alt || ''}
                onChange={(e) => updateContent({ alt: e.target.value })}
                placeholder="Image description"
              />
            </div>
          </div>
        )}

        {selectedComponent.type === 'button' && (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={selectedComponent.content?.text || ''}
                onChange={(e) => updateContent({ text: e.target.value })}
                placeholder="Click Here"
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={selectedComponent.content?.href || ''}
                onChange={(e) => updateContent({ href: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="buttonColor">Button Color</Label>
              <Input
                id="buttonColor"
                type="color"
                value={selectedComponent.content?.buttonStyles?.backgroundColor || '#8b5cf6'}
                onChange={(e) => updateContent({ 
                  buttonStyles: { 
                    ...selectedComponent.content?.buttonStyles, 
                    backgroundColor: e.target.value 
                  } 
                })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const EmailBuilder: React.FC<EmailBuilderProps> = ({ 
  onContentChange, 
  initialComponents = [] 
}) => {
  const [components, setComponents] = useState<EmailComponent[]>(initialComponents)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const selectedComponent = components.find(c => c.id === selectedComponentId) || null

  const addComponent = useCallback((type: string, index?: number) => {
    const newComponent: EmailComponent = {
      id: generateId(),
      type: type as any,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    }

    setComponents(prev => {
      const newComponents = [...prev]
      if (index !== undefined) {
        newComponents.splice(index, 0, newComponent)
      } else {
        newComponents.push(newComponent)
      }
      return newComponents
    })
    
    setSelectedComponentId(newComponent.id)
  }, [])

  const updateComponent = useCallback((id: string, updatedComponent: EmailComponent) => {
    setComponents(prev => prev.map(c => c.id === id ? updatedComponent : c))
  }, [])

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id))
    if (selectedComponentId === id) {
      setSelectedComponentId(null)
    }
  }, [selectedComponentId])

  const generateHTML = useCallback(() => {
    // Generate clean HTML from components
    const componentHTML = components.map(component => {
      // Convert component to HTML
      return generateComponentHTML(component)
    }).join('\n')

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        ${componentHTML}
    </div>
</body>
</html>`
  }, [components])

  // Update parent when components change
  React.useEffect(() => {
    onContentChange(generateHTML(), components)
  }, [components, generateHTML, onContentChange])

  const previewSizes = {
    desktop: 'w-full max-w-4xl',
    tablet: 'w-full max-w-2xl',
    mobile: 'w-full max-w-sm'
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex">
        {/* Left Panel - Components */}
        <div className="w-64 bg-card border-r p-4 overflow-y-auto">
          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="mt-4">
              <ComponentPalette />
            </TabsContent>
            
            <TabsContent value="templates" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Email templates coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Email Builder</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-4 overflow-auto bg-muted/30">
            <div className={cn("mx-auto transition-all duration-200", previewSizes[previewMode])}>
              <EmailCanvas
                components={components}
                selectedId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                onUpdateComponent={updateComponent}
                onDeleteComponent={deleteComponent}
                onAddComponent={addComponent}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-card border-l p-4 overflow-y-auto">
          <PropertyPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={(component) => updateComponent(component.id, component)}
          />
        </div>
      </div>
    </DndProvider>
  )
}

// Helper functions
function getDefaultContent(type: string) {
  switch (type) {
    case 'heading':
      return { text: 'Your Heading Here' }
    case 'text':
      return { text: 'Edit this text block...' }
    case 'image':
      return { src: '', alt: '', width: '100%' }
    case 'button':
      return { text: 'Click Here', href: '#', buttonStyles: { backgroundColor: '#8b5cf6' } }
    case 'divider':
      return {}
    case 'spacer':
      return { height: '20px' }
    default:
      return {}
  }
}

function getDefaultStyles(type: string) {
  switch (type) {
    case 'heading':
      return { margin: '0 0 16px 0', fontSize: '24px', fontWeight: 'bold' }
    case 'text':
      return { margin: '0 0 16px 0', fontSize: '16px', lineHeight: '1.6' }
    case 'image':
      return { margin: '0 0 16px 0', textAlign: 'center' }
    case 'button':
      return { margin: '16px 0', textAlign: 'center' }
    case 'divider':
      return { margin: '24px 0' }
    case 'spacer':
      return {}
    default:
      return {}
  }
}

function generateComponentHTML(component: EmailComponent): string {
  const styleString = Object.entries(component.styles)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ')

  switch (component.type) {
    case 'heading':
      return `<h1 style="${styleString}">${component.content.text}</h1>`
    case 'text':
      return `<p style="${styleString}">${component.content.text}</p>`
    case 'image':
      return `<div style="${styleString}"><img src="${component.content.src}" alt="${component.content.alt}" style="max-width: 100%; height: auto;" /></div>`
    case 'button':
      const buttonStyles = Object.entries(component.content.buttonStyles || {})
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ')
      return `<div style="${styleString}"><a href="${component.content.href}" style="display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 6px; color: white; ${buttonStyles}">${component.content.text}</a></div>`
    case 'divider':
      return `<div style="${styleString}"><hr style="border: none; border-top: 1px solid #e5e7eb;" /></div>`
    case 'spacer':
      return `<div style="height: ${component.content.height}; ${styleString}"></div>`
    default:
      return ''
  }
}