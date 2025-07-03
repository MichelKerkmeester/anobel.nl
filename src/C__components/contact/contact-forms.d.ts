// Type declarations for Contact Form modules

interface Window {
  // Initialization flags
  __ContactFormCoordinatorInitialized?: boolean;
  __ContactFormAttributesInitialized?: boolean;
  __ContactFormMemoryInitialized?: boolean;
  __ContactFormValidationInitialized?: boolean;
  __ContactFormShortcutsInitialized?: boolean;
  __ContactFormSubmissionInitialized?: boolean;
  __ContactFormsInitialized?: boolean;
  
  // Module APIs
  ContactFormCoordinator?: {
    register: (name: string, module: any) => void;
    initForm: (form: HTMLFormElement) => void;
    cleanupForm: (form: HTMLFormElement) => void;
    initAll: () => void;
    on: (event: string, handler: Function) => void;
    off: (event: string, handler: Function) => void;
    emit: (event: string, data?: any) => void;
    start: () => void;
    stop: () => void;
    Logger: {
      log: (...args: any[]) => void;
      warn: (...args: any[]) => void;
      error: (...args: any[]) => void;
      isEnabled: boolean;
    };
    getState: () => any;
    getRegisteredModules: () => string[];
    isModuleInitialized: (name: string) => boolean;
    isFormInitialized: (form: HTMLFormElement) => boolean;
  };
  
  ContactFormAttributes?: any;
  FormMemory?: any;
  FormValidation?: any;
  FormSubmission?: any;
  
  // External libraries
  Botpoison?: {
    challenge: (publicKey: string) => Promise<{ solution: string }>;
  };
  
  Webflow?: {
    push?: (callback: () => void) => void;
    ready?: (callback: () => void) => void;
  };
}

interface Document {
  _shortcutsListenerAdded?: boolean;
}

interface HTMLFormElement {
  _formHandlersAttached?: boolean;
  _validationInitialized?: boolean;
}