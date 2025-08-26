import os
import pandas as pd
import torch
import torch.nn as nn
from torchvision import transforms, models
from torch.utils.data import Dataset, DataLoader
from PIL import Image

# Configurações
img_dir = "./content/chairs/"
csv_labels = "./rotulos.csv"
batch_size = 16
num_epochs = 10
lr = 0.0005
img_size = 224
device = "cuda" if torch.cuda.is_available() else "cpu"

# Transforms
transform = transforms.Compose([
    transforms.Resize((img_size, img_size)),
    transforms.ToTensor()
])

# Dataset personalizado
class ChairCountDataset(Dataset):
    def __init__(self, csv_file, img_dir, transform=None):
        self.data = pd.read_csv(csv_file)
        self.img_dir = img_dir
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        row = self.data.iloc[idx]
        img_path = os.path.join(self.img_dir, row['arquivo'])
        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        label = torch.tensor([row['qtd_cadeiras']], dtype=torch.float32)
        return image, label

# Carregar dataset
dataset = ChairCountDataset(csv_labels, img_dir, transform)
loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

# Modelo de regressão baseado em ResNet
class Regressor(nn.Module):
    def __init__(self):
        super().__init__()
        base = models.resnet18(pretrained=True)
        base.fc = nn.Linear(base.fc.in_features, 1)
        self.model = base

    def forward(self, x):
        return self.model(x)

# Instanciar modelo
model = Regressor().to(device)
loss_fn = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=lr)

# Treinamento
print("🚀 Treinando modelo...")
for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    for imgs, labels in loader:
        imgs, labels = imgs.to(device), labels.to(device)
        preds = model(imgs)
        loss = loss_fn(preds, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{num_epochs} - Loss: {total_loss:.4f}")

# Função para testar em imagem nova
def prever_qtd_cadeiras(imagem_path):
    imagem = Image.open(imagem_path).convert("RGB")
    imagem = transform(imagem).unsqueeze(0).to(device)
    with torch.no_grad():
        pred = model(imagem)
    return round(pred.item())

# Exemplo de uso
imagem_teste = os.path.join(img_dir, "img002_ncs.jpg")
print(f"\n🪑 Cadeiras previstas na imagem: {prever_qtd_cadeiras(imagem_teste)}")
