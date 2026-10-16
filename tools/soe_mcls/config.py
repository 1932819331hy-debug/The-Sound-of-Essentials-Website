from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SOE Market Campaign Launch System"
    BASE_DOMAIN: str = "https://soelearn.com"
    
    # Meta API
    META_ACCESS_TOKEN: str = "mock_meta_token"
    META_AD_ACCOUNT_ID: str = "act_000000000"
    META_PIXEL_ID: str = "000000000000"
    META_PAGE_ID: str = "000000000000"
    META_API_VERSION: str = "v21.0"
    
    # Stripe
    STRIPE_SECRET_KEY: str = "sk_test_mock"
    STRIPE_WEBHOOK_SECRET: str = "whsec_mock"
    
    # Brevo CRM
    BREVO_API_KEY: str = "xkeysib-mock"
    BREVO_SENDER_EMAIL: str = "info@soelearn.com"
    BREVO_SENDER_NAME: str = "The Sound of Essentials"
    
    # AI Creative Providers
    GEMINI_API_KEY: str = "mock_gemini_key"
    FAL_KEY: str = "mock_fal_key"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
